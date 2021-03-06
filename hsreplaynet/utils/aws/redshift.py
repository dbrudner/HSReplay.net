from django.conf import settings
from django.core.cache import caches
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from hsredshift.analytics.queries import RedshiftCatalogue
from hsreplaynet.utils.influx import influx


def get_redshift_cache_redis_client():
	return caches["redshift"].client.get_client()


def get_redshift_engine(etl_user=False):
	db = settings.REDSHIFT_DATABASE
	username = db["ETL_USER"] if etl_user else db["USER"]
	password = db["ETL_PASSWORD"] if etl_user else db["PASSWORD"]
	url = URL(
		db["ENGINE"],
		username=username, password=password,
		host=db["HOST"], port=db["PORT"],
		database=db["NAME"]
	)
	return create_engine(
		url, poolclass=NullPool,
		connect_args=settings.REDSHIFT_DATABASE["OPTIONS"]
	)


def get_new_redshift_connection(autocommit=True, etl_user=False):
	conn = get_redshift_engine(etl_user).connect()
	if autocommit:
		conn.execution_options(isolation_level="AUTOCOMMIT")
	return conn


def get_new_redshift_session(autoflush=False):
	Session = sessionmaker()
	session = Session(bind=get_new_redshift_connection(autocommit=False), autoflush=autoflush)
	return session


def get_redshift_catalogue():
	cache = get_redshift_cache_redis_client()
	engine = get_redshift_engine()
	catalogue = RedshiftCatalogue.instance(
		cache=cache,
		engine=engine,
		aws_access_key_id=settings.AWS_CREDENTIALS["AWS_ACCESS_KEY_ID"],
		aws_secret_access_key=settings.AWS_CREDENTIALS["AWS_SECRET_ACCESS_KEY"],
		s3_unload_bucket=settings.S3_UNLOAD_BUCKET,
		s3_unload_namespace=settings.S3_UNLOAD_NAMESPACE,
		influx_client=influx
	)
	return catalogue


def get_redshift_query(query):
	return get_redshift_catalogue().get_query(query)


def inflight_query_count(handle):
	query = "SELECT count(*) FROM STV_INFLIGHT WHERE label = '%s';" % handle
	return get_new_redshift_connection(etl_user=True).execute(query).scalar()


def has_inflight_queries(handle):
	return inflight_query_count(handle) > 0


def is_analyze_skipped(handle):
	query_template = """
		SELECT count(*)
		FROM STL_UTILITYTEXT u
		JOIN stl_analyze a ON a.xid = u.xid
		WHERE label = '{handle}'
		AND text like 'Analyze%%'
		AND status = 'Skipped';
	"""
	query = query_template.format(handle=handle)
	count = get_new_redshift_connection(etl_user=True).execute(query).scalar()
	return count >= 1
