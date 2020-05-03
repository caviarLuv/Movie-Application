import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data';
import { SignupData } from './signup-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private username: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  baseurl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
      return this.token;
  }

  getIsAuth() {
      return this.isAuthenticated;
  }

  getUserId() {
      return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getAuthStatusListener() {
      return this.authStatusListener.asObservable();
  }

  // tslint:disable-next-line: variable-name
  createUser(username: string, pw: string, liked_genres: Array<string>) {
    const signupData: SignupData = { username, pw, liked_genres};
    this.http
        .post(this.baseurl + '/signup/', signupData)
        .subscribe(
            response => {
                this.loginOnRegister(username, pw);
            },
            error => {
                this.authStatusListener.next(false);
            }
        );
  }

  login(username: string, pw: string) {
    const authData: AuthData = { username, pw };
    this.http
        .post<{ token: string; expiresIn: number; userId: string }>(
          this.baseurl + '/api-token-auth/',
            authData
        )
        .subscribe(
            response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = 10000;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(
                        now.getTime() + expiresInDuration * 1000
                    );
                    this.updateData();
                    this.saveAuthData(token, expirationDate, this.userId, this.username);
                    this.router.navigate(['/']);
                }
            },
            error => {
                this.authStatusListener.next(false);
            }
        );
  }

  loginOnRegister(username: string, pw: string) {
    const authData: AuthData = { username, pw };
    this.http
        .post<{ token: string; expiresIn: number; userId: string }>(
          this.baseurl + '/api-token-auth/',
            authData
        )
        .subscribe(
            response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = 10000;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(
                        now.getTime() + expiresInDuration * 1000
                    );
                    this.updateData();
                    this.saveAuthData(token, expirationDate, this.userId, this.username);
                    this.router.navigate(['/']);
                }
            },
            error => {
                this.authStatusListener.next(false);
            }
        );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
        return;
    }
    const now = new Date();
    const expiresIn =
        authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.updateData();
        this.username = authInformation.username;
        this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
        this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token || !expirationDate) {
        return;
    }
    return {
        token,
        expirationDate: new Date(expirationDate),
        userId,
        username
    };
  }

  private updateData() {
    const tokenParts = this.token.split(/\./);
    const tokenDecoded = JSON.parse(window.atob(tokenParts[1]));
    this.username = tokenDecoded.username;
  }
}
