import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movielist/movielist.component';
import { MovieComponent } from './movie/movie.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';


const routes: Routes = [
  { path: '', component: MovieListComponent},
  { path: 'movies', component: MovieListComponent},
  { path: 'movie/:movieId', component: MovieComponent},
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: SigninComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
