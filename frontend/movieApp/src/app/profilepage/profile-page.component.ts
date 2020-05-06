import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  providers: [ApiService],
  styleUrls: ['./profile-page.component.css']
})

export class ProfilePageComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  userdata = [];

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private router2: Router,
    private authService: AuthService) {
      this.router.paramMap.subscribe(params => {
        this.username = params.get('username');
      });
      console.log(this.username);
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
      });
    this.getUserData(this.username);
  }

  getUserData(username: string) {
    this.api.getUserById(username).subscribe(
      data => {
        this.userdata = JSON.parse(data);
        console.log(this.userdata);
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnDestroy() {}
}
