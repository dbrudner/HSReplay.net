import binascii
import datetime
import logging
import os
import time
from dateutil.relativedelta import relativedelta


_timing_start = time.clock()
logger = logging.getLogger(__file__)


def _time_elapsed():
	return (time.clock() - _timing_start) * 10000


def _reset_time_elapsed():
	global _timing_start
	_timing_start = time.clock()


def generate_key():
	return binascii.hexlify(os.urandom(20)).decode()


def get_client_ip(request):
	"""
	Get the IP of a client from the request
	"""
	x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
	if x_forwarded_for:
		return x_forwarded_for.split(",")[0]
	return request.META.get("REMOTE_ADDR")


def deduplication_time_range(ts):
	"""
	From a datetime, return a tuple of (datetime_min, datetime_max)
	of the range margin around that datetime allowed for deduplication.
	"""
	margin = datetime.timedelta(hours=6)
	return ts - margin, ts + margin


def guess_ladder_season(timestamp):
	epoch = datetime.datetime(2014, 1, 1)
	epoch_season = 1
	delta = relativedelta(timestamp, epoch)
	months = (delta.years * 12) + delta.months
	return epoch_season + months
