from pymongo import MongoClient

def db_conn():
	conn = MongoClient('54.166.202.179', 27021)
	return conn


def query():
	return 0