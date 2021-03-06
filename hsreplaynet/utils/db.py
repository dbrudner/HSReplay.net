from django.db import connection


def dictfetchall(cursor):
	"""Return all rows from a cursor as a dict"""
	columns = [col[0] for col in cursor.description]
	return [
		dict(zip(columns, row))
		for row in cursor.fetchall()
	]


def execute_query(query):
	with connection.cursor() as cursor:
		cursor.execute(query)
		ret = dictfetchall(cursor)

	return ret
