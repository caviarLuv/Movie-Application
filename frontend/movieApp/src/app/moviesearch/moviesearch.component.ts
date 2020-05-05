import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-movie',
  templateUrl: './moviesearch.component.html',
  providers: [ApiService],
  styleUrls: ['./moviesearch.component.css']
})

export class MovieSearchComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  movies = [];
  movieTitle;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private router2: Router,
    ) {
      // this.router.paramMap.subscribe(params => {
      //   this.movieTitle = params.get('movieTitle');
      // });
      // this.viewList(this.movieTitle);
    }

    ngOnInit() {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.username = this.authService.getUsername();
        });
      this.router.paramMap.subscribe(params => {
        this.movieTitle = params.get('movieTitle');
        this.viewList(this.movieTitle);
      });
    }

    viewList(movieTitle: string) {
    this.api.searchForMovie(movieTitle).subscribe(
      data => {
        this.movies = JSON.parse(data);
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

