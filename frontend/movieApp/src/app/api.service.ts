import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = "http://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getTopTenMovies(): Observable<any>{
    return this.http.get(this.baseurl + '/top10Movies/', {headers: this.httpHeaders});
  }

  getMovieById(movieId: number): Observable<any>{
    const data = {'movieId': movieId};
    return this.http.post(this.baseurl + '/getMovieById/', data, {headers: this.httpHeaders});
  }

  getUserById(username: string): Observable<any>{
    const data = {'username': username};
    return this.http.post(this.baseurl + '/getUserById/', data, {headers: this.httpHeaders});
  }

  getMovieLink(movieId: number): Observable<any>{
    const data = {'movieId': movieId};
    return this.http.post(this.baseurl + '/getMovieLinks/', data, {headers: this.httpHeaders});
  }

  getMovieList(username: string): Observable<any>{
    const data = {'username': username};
    return this.http.post(this.baseurl + '/getusermovielist/', data, {headers: this.httpHeaders});
  }

  getSimilarMovies(movieId: number): Observable<any>{
    const data = {'movieId': movieId};
    return this.http.post(this.baseurl + '/getSimilarMovies/', data, {headers: this.httpHeaders});
  }

  searchForMovie(movieTitle: string): Observable<any> {
    const data = { 'title': movieTitle };
    return this.http.post(this.baseurl + '/getmoviebyname/', data, {headers: this.httpHeaders});
  }

  getMovieRecs(username: string): Observable<any>{
    const data = { 'username': username };
    return this.http.post(this.baseurl + '/recommendByGenre_Liked/', data, {headers: this.httpHeaders});
  }

  getGenreTop(genre: string): Observable<any>{
    const data = { 'genre': genre };
    return this.http.post(this.baseurl + '/getMoviesByGenre/', data, {headers: this.httpHeaders});
  }

  addComment(movieId: number, username: string, comment: string): Observable<any>{
    const data = {
      'movieId': movieId,
      comment: {'username': username, 'comment': comment}
    };
    return this.http.post(this.baseurl + '/addMovieComment/', data, {headers: this.httpHeaders});
  }

  addRating(movieId: number, username: string, rating: number): Observable<any>{
    const data = {
      'movieId': movieId,
      'username': username,
      'rating': rating,
      'timestamp': Date.now()
    }
    return this.http.post(this.baseurl + '/addMovieRating/', data, {headers: this.httpHeaders});
  }

  addMovie(movieId: number, username: string) {
    const data = {
      'username': username,
      'movieId': movieId
    };
    console.log(data);
    this.http
            .post<{ message: string; movie: string; user: string}>(
                this.baseurl + '/addMovieToList/',
                data
            )
            .subscribe(responseData => {
                this.router.navigate(['/profile/' + username]);
            });
  }

  removeMovie(movieId: number, username: string) {
    const data = {
      'username': username,
      'movieId': movieId
    };
    console.log(data);
    this.http
            .post<{}>(
                this.baseurl + '/deleteMoviefromList/',
                data
            )
            .subscribe(responseData => {
                this.router.navigate(['/movie/' + movieId]);
            });
  }

}

