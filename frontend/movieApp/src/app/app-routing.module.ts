import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movielist/movielist.component';
import { MovieComponent } from './movie/movie.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MovieSearchComponent } from './moviesearch/moviesearch.component'
import { AuthGuard } from './auth/auth-guard';
// import { SignupComponent } from './signup/signup.component';
// import { SigninComponent } from './signin/signin.component';


const routes: Routes = [
  { path: '', component: MovieListComponent},
  { path: 'movies', component: MovieListComponent},
  { path: 'movie/:movieId', component: MovieComponent},
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search/:movieTitle', component: MovieSearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
