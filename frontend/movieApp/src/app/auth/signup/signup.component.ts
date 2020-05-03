import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;

    signupForm;
    succeed = false;

    genres = [
      'Action',
      'Adventure',
      'Animation',
      'Children\'s',
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
      public authService: AuthService,
      private formBuilder: FormBuilder)
    {
      this.signupForm = this.formBuilder.group({
        username: '',
        pw: '',
        liked_genres: new FormArray([])});
      this.addGenre();
    }

    private addGenre() {
      this.genres.forEach((o, i) => {
        const control = new FormControl(i === -1);
        (this.signupForm.controls.liked_genres as FormArray).push(control);
      });
    }

    onSignup(userData) {
      const selectedGenres = this.signupForm.value.liked_genres.map((value, i)=>(value? this.genres[i]:null))
      .filter(value => value !== null);
      userData.liked_genres = selectedGenres;
      console.log(userData);
      this.authService.createUser(userData.username, userData.pw, userData.liked_genres);
  }

    ngOnInit() {
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(authStatus => {
                this.isLoading = false;
            });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}
