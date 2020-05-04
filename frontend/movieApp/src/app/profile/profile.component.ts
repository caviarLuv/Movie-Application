import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [ApiService],
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  intMovieId = 1234123;

  movies = [
    {
      title: 'matrix',
      desc: 'sci-fi movie',
      date: '1999'
    },
    {
      title: 'Avengers',
      desc: 'marvel movie',
      date: '2009'
    }
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.username = this.authService.getUsername();
      });
  }

  viewMovie(movieId: string) {
    this.router.navigate(['/movie/' + movieId]);
  }

  removeMovie() {
    this.api.removeMovie(this.intMovieId, localStorage.getItem('username'));
  }

  ngOnDestroy() {}
}
