from django.conf.urls import url
from . import views


urlpatterns = [
	url(
		r"^query/(?P<name>\w+)/$", views.fetch_query_results,
		name="analytics_fetch_query_results"
	),
	url(
		r"^local/query/(?P<name>\w+)/$", views.fetch_local_query_results,
		name="analytics_fetch_local_query_results"
	),
	url(
		r"^evict/(?P<name>\w+)/$", views.evict_query_from_cache,
		name="analytics_evict_from_cache"
	),
	url(
		r"^evictall/(?P<name>\w+)/$", views.evict_all_from_cache,
		name="analytics_evict_all_from_cache"
	),
	url(
		r"^refresh/(?P<name>\w+)/$", views.refresh_query_from_cache,
		name="analytics_refresh_from_cache"
	),
	url(
		r"^refreshall/(?P<name>\w+)/$", views.refresh_all_from_cache,
		name="analytics_refresh_all_from_cache"
	),
	url(
		r"^release/semaphore/(?P<name>\w+)/$", views.release_semaphore,
		name="analytics_release_semaphore"
	),
]

api_urlpatterns = [
	url(
		r"^v1/analytics/query/(?P<name>\w+)/$", views.fetch_query_results,
		name="analytics_api_fetch_query_results"
	),
]
