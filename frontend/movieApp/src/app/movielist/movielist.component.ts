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
  topTen = [];

  constructor(
    private api: ApiService,
    private router: Router) {
    this.getTopMovies();
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

  navigateTo(movieId) {
    this.router.navigate(['/movie/' + movieId]);
  }

  viewMovie(movieId: number) {
    this.api.getMovieById(movieId).subscribe(
      data => {
        let movie = JSON.parse(data);
        console.log(movie);
      }
    )
  }
}
