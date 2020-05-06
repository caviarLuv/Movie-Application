import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [ApiService],
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  constructor(private router: Router, private api: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.username = this.authService.getUsername();
        });
  }

  viewProfile() {
    this.router.navigate(['/profile/' + localStorage.getItem('username')]);
  }

  viewProfilePage() {
    this.router.navigate(['/profilepage/' + localStorage.getItem('username')])
  }

  onLogout() {
    this.authService.logout();
  }

  onSearch(form: NgForm) {
    if (form.invalid) {
        return;
    }
    this.router.navigate(['/search/' + form.value.searchTitle]);
  }

  ngOnDestroy() {}
}
