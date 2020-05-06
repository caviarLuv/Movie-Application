import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-genre-list',
  templateUrl: './genre-list.component.html',
  providers: [ApiService],
  styleUrls: ['./genre-list.component.css']
})

export class GenreListComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  genre: string;
  movies = [];

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private router2: Router,
    ) {
    }

    ngOnInit() {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
      this.router.paramMap.subscribe(params => {
        this.genre = params.get('genre');
        console.log(this.genre);
        this.getGenreList(this.genre);
      });
    }

    getGenreList(genre: string) {
    this.api.getGenreTop(genre).subscribe(
      data => {
        this.movies = JSON.parse(data);
      }
    );
  }

    navigateTo(movieId) {
      this.router2.navigate(['/movie/' + movieId]);
    }

    ngOnDestroy() {}
}

