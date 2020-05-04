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
import os, bcrypt, jwt, datetime, pymongo
from bson.json_util import dumps

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
			response = Response({"token": token})
		else:
			response = Response({"error": "fail to authenticate"}, status=status.HTTP_400_BAD_REQUEST)
	else:
		response = Response({"error": "username doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
	conn.close()
	return response

# return a boolean
def verifyToken(token):
	jwt.decode(token, settings.SECRET_KEY, algorithm='HS256')

# Sign-up
@api_view(['POST'])
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
		conn.close()
		response = Response({"succeed": "true"})
	else:
		response = Response({"succeed": "false"})
	conn.close()
	return response


@api_view(['POST'])
def addMovieToList(request):
	un = request.data['username']
	movieId = request.data['movieId']
	conn = db_conn()
	user = conn.movieApp.users.find_one({"username": un})
	if user != None:
		conn.movieApp.users.update_one({"username": un}, {"$addToSet": {"movie_list": movieId}})
	conn.close()
	return Response({"succeed": "movie is added!"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def deleteMoviefromList(request):
	un = request.data['username']
	movieId = request.data['movieId']
	conn = db_conn()
	#delete the movie from userlist
	db = conn.movieApp
	user = db.users.find_one({"username":un})
	if user != None and movieId != None:
		db.users.update_one({'username':un},{'$pull':{'movie_list':movieId}})
	else:
		return Response({"Movie not found"})
	conn.close()
	return Response({"Movie Deleted Successfully"})




@api_view(['GET'])
def top10Movies(request):
	conn = db_conn()
	movies = conn.movieApp.movies
	top10 = movies.find({},{"_id": 0, "genres": 0}).sort("avg_rating", pymongo.DESCENDING).limit(10)
	toplist = []
	for doc in top10:
		toplist.append(doc)
	conn.close()
	return Response(dumps(toplist), status=status.HTTP_200_OK)


@api_view(['POST'])
def getMovieLinks(request):
	movieId = request.data['movieId']
	conn = db_conn()
	links = conn.movieApp.links.find_one({"movieId": movieId}, {"_id": 0})
	conn.close()
	return Response(links, status=status.HTTP_200_OK)

@api_view(['POST'])
def getMoviesByGenre(request):
	genre = request.data['genre']
	conn = db_conn()
	collection = conn.movieApp.movies
	movies = collection.find({"genres": genre}, {"movieId": 1, "title": 1, "_id": 0})
	conn.close()
	return Response(dumps(list(movies)), status=status.HTTP_200_OK)
