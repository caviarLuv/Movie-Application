from django.conf.urls import url
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from movieApp import views
from rest_framework import routers
 
 
router = routers.DefaultRouter()
#router.register(r'movies', views.MovieView)
urlpatterns = [
	url(r'^movies/$', views.MovieView.as_view()),
	url(r'^signup/', views.createUser),
	#insert movie id into movie_list
	url(r'^addMovieToList/', views.addMovieToList),
	url(r'^top10Movies/', views.top10Movies),
	#delete movie id from movie_list
	url(r'^deleteMoviefromList/', views.deleteMoviefromList),
	url(r'^getmoviebyname/',views.getMoviebyName),
	path(r'api-token-auth/', views.authentication),
    path(r'api-token-refresh/', refresh_jwt_token),
	#path('index', views.index),
    url(r'^$', include(router.urls)),
    url(r'^getMovieLinks/', views.getMovieLinks),
    url(r'^getMoviesByGenre/', views.getMoviesByGenre),
	url(r'^getMovieById/', views.getMovieById),
	url(r'^recommandByGenre_Liked/', views.recommandByUserInterest),
  	url(r'^getMovieList/', views.getMovieList)
	]