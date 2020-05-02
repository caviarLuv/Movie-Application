import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movielist',
  templateUrl: './movielist.component.html',
  providers: [ApiService],
  styleUrls: ['./movielist.component.css']
})

export class MovieListComponent {
  movies = [{title: 'test'}];

  constructor(
    private api: ApiService,
    private router: Router) {
    this.getMovies();
  }

  getMovies = () => {
    this.api.getAllMovies().subscribe(
      data => {
        this.movies = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  viewMovie(movieId: string) {
    this.router.navigate(['/movie/' + movieId]);
  }
}
