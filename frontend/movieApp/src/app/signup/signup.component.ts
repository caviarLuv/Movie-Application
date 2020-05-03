import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [ApiService],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
	signupForm;
	succeed=false;
	genres = [
		"Action",
		"Adventure",
		"Animation",
		"Children's",
		"Comedy",
		"Crime",
		"Documentary",
		"Drama",
		"Fantasy",
		"Film-Noir",
		"Horror",
		"Musical",
		"Mystery",
		"Romance",
		"Sci-Fi",
		"Thriller",
		"War",
		"Western"
	];
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router)
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
  	})
  }


//user data {un:"value", pw:"value", liked_genre: "array"}
  onSubmit(userData) {
  	const selectedGenres = this.signupForm.value.liked_genres.map((value, i)=>(value? this.genres[i]:null))
  	.filter(value => value !== null);
  	userData.liked_genres = selectedGenres;
  	this.signupForm.reset();
  	this.createUser(userData);
  }

  createUser(userData) {
    console.warn('creating', userData);
    this.api.createUser(userData).subscribe(
      data => {
        console.log('user in database? ' + data.succeed);
        this.router.navigate(['/']);
      },
      error => {console.log(error); }
    );
  }
}
