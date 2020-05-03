import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MovieListComponent } from './movielist/movielist.component';
import { MatIconModule } from '@angular/material/icon';
import { SignupComponent } from './signup/signup.component'
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieComponent } from './movie/movie.component';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MovieListComponent,
    SignupComponent,
    MovieComponent,
    ProfileComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
