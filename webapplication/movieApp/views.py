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
import os, bcrypt, jwt, datetime, pymongo, random
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
		return Response(dumps(toplist), status=status.HTTP_200_OK)
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
	movies = collection.find({"genres": genre}, {"movieId": 1, "title": 1, "_id": 0})\
		.sort("avg_rating", pymongo.DESCENDING).limit(10)
	conn.close()
	return Response(dumps(list(movies)), status=status.HTTP_200_OK)

@api_view(['POST'])
def getMoviebyName(request):
	name = request.data['title']
	conn = db_conn()
	db = conn.movieApp
	moviename = list(db.movies.find({'title':{"$regex":name, "$options" : 'i'}},{"_id": 0}).limit(10))
	if moviename != None:
		return Response(dumps(moviename), status = status.HTTP_200_OK)
	else:
		return Response({"Movie not Found"})
	conn.close()

@api_view(['POST'])
#Pass the movie ID
def averageRatingbymovieID(request):
	movie_id = int(request.data['movieId'])
	conn = db_conn()
	db = conn.movieApp
	ratings = list(db.ratings.aggregate([{"$group": {"_id": movie_id, "Rating": {"$avg": "$rating"}}}]))
	individual_rating = ratings[0]['Rating']
	db.movies.update_one({"movieId":movie_id},{"$set":{"avg_rating":individual_rating}})
	conn.close()
	if ratings is not None:
		return Response(dumps(ratings), status = status.HTTP_200_OK)

@api_view(['POST'])
def getMovieById(request):
	movieId = request.data['movieId']
	conn = db_conn()
	movie = conn.movieApp.movies
	movieData = movie.find({'movieId' : movieId}, {"_id": 0})
	conn.close()
	if movieData != None:
		return Response(dumps(movieData), status=status.HTTP_200_OK)
	else:
		return Response({"Movie not Found"})

@api_view(['POST'])
def getUserById(request):
	un = request.data['username']
	conn = db_conn()
	user = conn.movieApp.users
	userData = user.find({'username': un}, {"_id":0, "pw":0})
	conn.close()
	if userData != None:
		return Response(dumps(userData), status=status.HTTP_200_OK)
	else:
		return Response({"User not Found"})

@api_view(['POST'])
def getMovieList(request):
	usermovienamelist = []
	un = request.data['username']
	conn = db_conn()
	userList = conn.movieApp.users.find({"username": un},{"movie_list": 1,'_id': 0})
	conn.close()
	if userList != None:
		for movieid in userList[0]['movie_list']:
			movieData = conn.movieApp.movies.find({'movieId': movieid},{"_id": 0})
			usermovienamelist.append(movieData)
		return Response(dumps(usermovienamelist), status=status.HTTP_200_OK)
	else:
		return Response({"User doesn't have list"})

@api_view(['POST'])
# pass in user id and return 10 random recommendations
def recommandByUserInterest(request):
	username = request.data['username']
	conn = db_conn()
	genres = conn.movieApp.users.find_one({"username": username})["liked_genres"]
	choice = list(conn.movieApp.movies.find({"genres": {"$elemMatch": {"$in": genres}}}, {"_id": 0}))
	size = conn.movieApp.movies.count_documents({"genres": {"$elemMatch": {"$in": genres}}})
	suggestMovies = list()
	for i in range(10):
		randomIndex = random.randrange(size)
		suggestMovies.append(choice[randomIndex])
		choice.pop(randomIndex)
		size -= 1
	conn.close()
	return Response(dumps(suggestMovies), status=status.HTTP_200_OK)


@api_view(['POST'])
# pass in movieId
def getSimilarMovies(request):
	movieId = request.data['movieId']
	conn = db_conn()
	movieGenre = conn.movieApp.movies.find_one({"movieId": movieId}, {"_id": 0, "genres": 1})['genres']
	similarMovieCandidate = list(conn.movieApp.movies.find({"movieId": {"$ne": movieId},  "genres": {"$elemMatch": {"$in": movieGenre}}}, {"_id": 0}))
	size = conn.movieApp.movies.count_documents({"movieId": {"$ne": movieId},  "genres": {"$elemMatch": {"$in": movieGenre}}})
	suggestMovies = list()
	for i in range(10):
		randomIndex = random.randrange(size)
		suggestMovies.append(similarMovieCandidate[randomIndex])
		similarMovieCandidate.pop(randomIndex)
		size -= 1
	conn.close()
	return Response(dumps(suggestMovies), status=status.HTTP_200_OK)


@api_view(['POST'])
def getLikedGenres(request):
	un = request.data['username']
	conn = db_conn()
	liked_genres = conn.movieApp.users.find_one({"username": un}, {"_id": 0,"liked_genres": 1})
	print(liked_genres)
	conn.close()
	return Response(liked_genres, status=status.HTTP_200_OK)

@api_view(['POST'])
def addMovieComment(request):
	movieId = request.data['movieId']
	document = request.data['comment']
	conn = db_conn()
	result = conn.movieApp.movies.update_one({"movieId": movieId}, {"$addToSet": {"comments": document}})
	conn.close()
	if result.modified_count:
		return Response({"Comment inserted"}, status=status.HTTP_200_OK)
	else:
		return Response({"Error, Comment not added"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def addMovieRating(request):
	movieId = request.data['movieId']
	username = request.data['username']
	rating = request.data['rating']
	timestamp = request.data['timestamp']
	conn = db_conn()
	result = conn.movieApp.ratings.insert_one({"userId": username, "movieId": movieId, "rating": rating, "timestamp": timestamp})
	if result.acknowledged:
		db = conn.movieApp
		ratings = list(db.ratings.aggregate([{"$group": {"_id": movieId, "Rating": {"$avg": "$rating"}}}]))
		individual_rating = ratings[0]['Rating']
		db.movies.update_one({"movieId":movieId},{"$set":{"avg_rating":individual_rating}})
		conn.close()
		return Response({"rating inserted"}, status=status.HTTP_200_OK)
	else:
		conn.close()
		return Response({"rating insertion fail"}, status=status.HTTP_400_BAD_REQUEST)



