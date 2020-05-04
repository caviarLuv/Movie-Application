import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  providers: [ApiService],
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  movie = {
    title: 'test',
    desc: 'this is a test description',
    date: '1999'
  };
  movieId;

  intMovieId = 1234123;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService
    ) {
      // this.getMovie();
    }

    ngOnInit() {
      this.router.paramMap.subscribe(params => {
        this.movieId = params.get('movieId');
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.username = this.authService.getUsername();
        });
    }

    getMovie = () => {
      this.api.getMovie(this.movieId).subscribe(
        data => {
          this.movie = data;
        },
        error => {
          console.log(error);
        }
      );
    }

    addMovie() {
      this.api.addMovie(this.intMovieId, localStorage.getItem('username'));
    }

    ngOnDestroy() {}
}

