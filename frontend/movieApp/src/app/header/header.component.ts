import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [ApiService],
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private router: Router, private api: ApiService) {}

  viewProfile() {
    this.router.navigate(['/profile/' + '23']);
  }

  logged_in = this.api.username;
  logout() {
  	console.log("logged out");
  	this.logged_in = null;
    this.api.userLogout();
    this.router.navigate(['']);
  }

}
