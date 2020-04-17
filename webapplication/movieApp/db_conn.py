from pymongo import MongoClient

def db_conn():
	conn = MongoClient('54.162.71.107', 27017)
	return conn


def query():
	return 0