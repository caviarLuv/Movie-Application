import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
  movieLink: string;
  imdbLink: string;
  hasComments = false;

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
          console.log(this.movie);
          if (this.movie[0].comments !== undefined) {this.hasComments = true; }
          this.getSimilarMovies();
          this.getMovieLink();
        }
      );
    }

    getMovieLink() {
      this.api.getMovieLink(this.movieId).subscribe(
        data => {
          this.movieLink = data.imdbId.toString();
          console.log(this.movieLink.length);
          while (this.movieLink.length < 7) {
            this.movieLink = '0' + this.movieLink;
          }
          this.imdbLink = 'https://www.imdb.com/title/tt' + this.movieLink;
        }
      );
    }

    imdbURL() {
      window.location.href = this.imdbLink;
    }

    addMovie() {
      this.api.addMovie(this.movieId, localStorage.getItem('username'));
    }

    addComment(form: NgForm) {
      this.api.addComment(this.movieId, localStorage.getItem('username'), form.value.comment).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
      this.api.addRating(this.movieId, localStorage.getItem('username'), form.value.rating).subscribe(
        data => {
           console.log(data)
           this.router2.navigateByUrl('/', { skipLocationChange: true }).then(() => {
           this.router2.navigate(['/movie/' + this.movieId]);
          });
        },
        error=>{console.log(error)});
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

