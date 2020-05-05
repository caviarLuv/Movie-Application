import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-movierecs',
  templateUrl: './movierecs.component.html',
  providers: [ApiService],
  styleUrls: ['./movierecs.component.css']
})

export class MovieRecsComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
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
            this.username = this.authService.getUsername();
        });
      this.router.paramMap.subscribe(params => {
        this.username = params.get('username');
        this.getRecs(this.username);
      });
    }

    getRecs(username: string) {
    this.api.getMovieRecs(username).subscribe(
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

