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
  topTen = [];

  constructor(
    private api: ApiService,
    private router: Router) {
    this.getMovies();
    this.getTopMovies();
  }

  getMovies = () => {
    this.api.getAllMovies().subscribe(
      data => {
        this.movies = data;
        // console.log(this.movies);
      },
      error => {
        console.log(error);
      }
    );
  }

  getTopMovies = () => {
    this.api.getTopTenMovies().subscribe(
      data => {
        this.topTen = JSON.parse(data);
        console.log(this.topTen);
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
