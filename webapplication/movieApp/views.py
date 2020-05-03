from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf import settings
 
# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework import serializers
from rest_framework import views
from rest_framework.views import APIView
from .db_conn import *
from .serializers import MovieSerializer
import os, bcrypt, jwt, datetime

class MovieView(APIView):
	def get(self, request):
		return Response([{"title": "hi"}, {"title": "hello"}])


### Authentication
# Sign-in overriding the authentication method
@api_view(['POST'])
def authentication(request):
	un = request.data['username']
	pw = request.data['pw']
	conn = db_conn()
	collection = conn.movieApp.users
	user = {"username": un}
	user = collection.find_one(user)
	if(user != None):
		pwhashed = user['pw']
		if bcrypt.checkpw(pw, pwhashed):
			payload = {
			'username': un,
			'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
			}
			token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
			return Response({"token": token})
		else:
			return Response({"error": "fail to authenticate"}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response({"error": "username doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

# return a boolean
def verifyToken(token):
	jwt.decode(token, settings.SECRET_KEY, algorithm='HS256')

# Sign-up
@api_view(['POST', 'GET'])
def createUser(request):
	un = request.data['username']
	pw = request.data['pw']
	liked_genres = request.data['liked_genres']
	pwhashed = bcrypt.hashpw(pw, bcrypt.gensalt())
	conn = db_conn()
	collection = conn.movieApp.users
	user = {"username": un,
	"pw": pwhashed,
	"liked_genres": liked_genres
	}
	if (collection.insert_one(user).acknowledged):
		return Response({"succeed": "true"})
	else:
		return Response({"succeed": "false"})
