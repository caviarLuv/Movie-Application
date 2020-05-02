import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movielist/movielist.component';
import { MovieComponent } from './movie/movie.component';


const routes: Routes = [
  { path: '', component: MovieListComponent},
  { path: 'movies', component: MovieListComponent},
  { path: 'movie/:movieId', component: MovieComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
