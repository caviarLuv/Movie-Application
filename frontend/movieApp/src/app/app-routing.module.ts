import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movielist/movielist.component';
import { MovieComponent } from './movie/movie.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', component: MovieListComponent},
  { path: 'movies', component: MovieListComponent},
  { path: 'movie/:movieId', component: MovieComponent},
  { path: 'profile/:userId', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
