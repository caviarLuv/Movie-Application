import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';

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
  movieList = [];
  movies = [];

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService) {
      this.router.paramMap.subscribe(params => {
        this.username = params.get('userId');
      });
      this.getMovieList(this.username);
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
      });
  }

  getMovieList(username) {
    this.api.getMovieList(username).subscribe(
      data => {
        this.movieList = JSON.parse(data);
        console.log(this.movieList);
        for (const x of this.movieList.movie_list) {
          this.viewMovie(x);
        }
        console.log(this.movies);
      }
    );
  }

  viewMovie(movieId: number) {
    this.api.getMovieById(movieId).subscribe(
      data => {
        this.movies.push(JSON.parse(data));
      }
    );
  }

  ngOnDestroy() {}
}
