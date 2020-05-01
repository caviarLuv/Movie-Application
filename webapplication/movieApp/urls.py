from django.conf.urls import url
from django.urls import path, include
 
from movieApp import views
from rest_framework import routers
 
 
router = routers.DefaultRouter()
#router.register(r'movies', views.MovieView)
urlpatterns = [
	url(r'^movies/$', views.MovieView.as_view()),
	#path('index', views.index),
    url(r'^$', include(router.urls)),
]