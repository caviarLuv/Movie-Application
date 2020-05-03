import { ApiService } from '../api.service';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  providers: [ApiService],
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
	signinForm;

  constructor(private api: ApiService, private formBuilder:FormBuilder) { 
	this.signinForm = this.formBuilder.group({
	username: '',
	pw: '',
	liked_genres: new FormArray([])});
}

  onSubmit(userdata) {
  	this.api.userLogin(userdata);
  }


  ngOnInit(): void {
  }

}
