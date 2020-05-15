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
  genres = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Fantasy',
    'Film-Noir',
    'Horror',
    'Musical',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
    'Western'
  ];

  constructor(
    private api: ApiService,
    private router: Router) {
    this.getTopMovies();
  }

  getTopMovies = () => {
    this.api.getTopTenMovies().subscribe(
      data => {
        this.topTen = JSON.parse(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  navigateTo(movieId) {
    this.router.navigate(['/movie/' + movieId]);
  }

  navigateToGenre(genre: string) {
    this.router.navigate(['/topbygenre/' + genre]);
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
