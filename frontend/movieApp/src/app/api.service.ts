import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = "http://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  public token: string;
  public token_expires: Date;
  public username;

  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<any>{
    return this.http.get(this.baseurl + '/movies', {headers: this.httpHeaders});
  }

  getMovie(movieId: string): Observable<any>{
    return this.http.get(this.baseurl + '/movie/' + movieId, {headers: this.httpHeaders});
  }
  createUser(userData): Observable<any> {
  	return this.http.post(this.baseurl+'/signup/', userData);
  }

  userLogin(userData) {
  	this.http.post(this.baseurl+ '/api-token-auth/', userData).subscribe(
  		data => {this.updateData(data['token'])},
  		error => {
  			console.log(error);
  		});
  }

   private updateData(token) {
  	this.token = token;
  	const token_parts = this.token.split(/\./);
  	const token_decoded = JSON.parse(window.atob(token_parts[1]));
  	this.token_expires = new Date(token_decoded.exp * 1000);
  	this.username = token_decoded.username;
	}
}

