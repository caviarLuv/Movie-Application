from django.shortcuts import render
from django.http import HttpResponse
from .db_conn import *

def index(request):
	if request.method == 'POST':
		conn = db_conn()
		db = conn.test
		users = db.users
		username = request.POST.get('user_name')
		pw = request.POST.get('password')
		user = {
			"username": username,
			"password": pw
		}
		users.insert_one(user)
	return render(request, 'movieApp/index.html')