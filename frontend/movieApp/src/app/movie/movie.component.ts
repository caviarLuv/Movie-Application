import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  movie = [];
  similarMovies = [];
  movieId;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private router2: Router,
    ) {
      this.router.paramMap.subscribe(params => {
        this.movieId = +params.get('movieId');
      });
      this.viewMovie(this.movieId);
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

    viewMovie(movieId: number) {
    this.api.getMovieById(movieId).subscribe(
      data => {
        this.movie = JSON.parse(data);
        this.getSimilarMovies();
      }
    )
  }

    addMovie() {
      this.api.addMovie(this.movieId, localStorage.getItem('username'));
    }

    getSimilarMovies() {
      this.api.getSimilarMovies(this.movieId).subscribe(
        data => {
          this.similarMovies = JSON.parse(data);
        },
        error => {
          console.log(error);
        }
      );
    }

    navigateTo(movieId) {
      // Weird hack to reload page
      this.router2.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router2.navigate(['/movie/' + movieId]);
      });
    }

    ngOnDestroy() {}
}

