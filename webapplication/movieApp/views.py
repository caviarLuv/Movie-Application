from django.shortcuts import render
from django.http import HttpResponse
from .db_conn import *

def index(request):
	conn = db_conn()
	if request.method == 'POST':
		db = conn.test
		users = db.users
		username = request.POST.get('user_name')
		pw = request.POST.get('password')
		user = {
			"username": username,
			"password": pw
		}
		users.insert_one(user)
	movies = conn.test.movies.find().limit(10)
	conn.close()
	return render(request, 'movieApp/index.html', {'movies':movies})