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
  movie = [];
  movieId;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService,
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
        console.log(this.movie);
      }
    )
  }

    addMovie() {
      this.api.addMovie(this.movieId, localStorage.getItem('username'));
    }

    ngOnDestroy() {}
}

