import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  providers: [ApiService],
  styleUrls: ['./movie.component.css']
})

export class MovieComponent {
  movie = {
    title: 'test',
    desc: 'this is a test description',
    date: '1999'
  };

  constructor(
    private api: ApiService,
    private router: Router) {}
}

