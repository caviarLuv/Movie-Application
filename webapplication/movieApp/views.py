from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView
 
 
# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework import serializers
from rest_framework import views
from rest_framework.views import APIView
from rest_framework_jwt.views import ObtainJSONWebToken
from .db_conn import *
from .serializers import MovieSerializer
import os, bcrypt

class MovieView(APIView):
	def get(self, request):
		return Response([{"title": "hi"}, {"title": "hello"}])


### Authentication
# Sign-in overriding the authentication method
class UserTokenView(ObtainJSONWebToken):
	def post(self, request, *args, **kwargs):
		un = request.data['username']
		pw = request.data['pw']
		conn = db_conn()
		collection = conn.movieApp.users
		user = {"username": un}
		pwhashed = collection.find_one(user)['pw']
		if bcrypt.checkpw(pw, pwhashed):
			return Response({"msg": "succeed"})
		else:
			return Response({"error": "fail to authenticate"}, status=status.HTTP_400_BAD_REQUEST)

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
