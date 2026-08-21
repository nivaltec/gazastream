import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlaylistComponent } from './components/play-list/play-list.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { PodcastComponent } from './components/podcast/podcast.component';
import { RadioComponent } from './components/radio/radio.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { AudioDetailsComponent } from './components/audio-details/audio-details.component';
import { GenreDetailsComponent } from './components/genre-details/genre-details.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { CatelogComponent } from './components/catelog/catelog.component';
import { UploadsComponent } from './components/uploads/uploads.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotificationsComponent } from './components/notifications/notifications.component';



const routes: Routes = [
    {path :'' , component:HomeComponent},
    {path: 'login',component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path:'home',component: HomeComponent},
    {path:'playlist',component: PlaylistsComponent},
    {path: 'playlist/:id',component: PlaylistComponent},
    {path:'favourites',component: FavouritesComponent},
    {path:'podcast',component: PodcastComponent},
    {path: 'podcast/:id',component: PodcastDetailComponent},
    {path:'radio',component: RadioComponent},
    {path: 'genre/:genreName',component: GenreDetailsComponent},
    {path: 'genres/:genre', component: GenreDetailsComponent },
    {path: 'music/:id',component: AudioDetailsComponent},
    {path:'profile',component: ProfileComponent},
    {path:'catelog',component: CatelogComponent},
    {path:'uploads',component: UploadsComponent},
    {path:'notifications',component: NotificationsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

