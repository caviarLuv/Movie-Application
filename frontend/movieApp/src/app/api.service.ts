import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = "http://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getAllMovies(): Observable<any>{
    return this.http.get(this.baseurl + '/movies', {headers: this.httpHeaders});
  }

  getMovie(movieId: string): Observable<any>{
    return this.http.get(this.baseurl + '/movie/' + movieId, {headers: this.httpHeaders});
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
                this.router.navigate(['/' + username]);
            });
  }

  removeMovie(movieId: string, username: string) {
    const formData = new FormData();
    formData.append('movieId', movieId);
    formData.append('username', username);
    console.log(username + ' ' + movieId);
    this.http
            .put<{ message: string; movie: string; user: string}>(
                this.baseurl + '/movie/' + movieId,
                formData
            )
            .subscribe(responseData => {
                this.router.navigate(['/' + username]);
            });
  }
}

