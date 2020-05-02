import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [ApiService],
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  movie = {
    title: 'matrix',
    desc: 'sci-fi movie',
    date: '1999'
  };

  movies = [
    {
      title: 'matrix',
      desc: 'sci-fi movie',
      date: '1999'
    },
    {
      title: 'Avengers',
      desc: 'marvel movie',
      date: '2009'
    }
  ];

  constructor(
    private api: ApiService,
    private router: Router) {
  }
}
