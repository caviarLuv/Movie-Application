import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  providers: [ApiService],
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {
  movie = {
    title: 'test',
    desc: 'this is a test description',
    date: '1999'
  };

  movieId;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    ) {
      // this.getMovie();
    }

    ngOnInit() {
      this.router.paramMap.subscribe(params => {
        this.movieId = params.get('movieId');
        console.log(this.movieId);
      });
    }

    getMovie = () => {
      this.api.getMovie(this.movieId).subscribe(
        data => {
          this.movie = data;
        },
        error => {
          console.log(error);
        }
      );
    }
}

