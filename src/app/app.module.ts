import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HTTP_INTERCEPTORS,HttpClientModule,provideHttpClient,withInterceptorsFromDi} from '@angular/common/http';


import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { HttpInterceptorService } from './middlewares/httpinterceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule, DecimalPipe, UpperCasePipe } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { AudioCardComponent } from './components/cards/audio-card/audio-card.component';
import { GenreCardComponent } from './components/cards/genre-card/genre-card.component';
import { VideoCardComponent } from './components/cards/video-card/video-card.component';
import { PodcastCardComponent } from './components/cards/podcast-card/podcast-card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { PlaylistComponent } from './components/play-list/play-list.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { RadioComponent } from './components/radio/radio.component';
import { PodcastComponent } from './components/podcast/podcast.component';
import { RadioCardComponent } from './components/cards/radio-card/radio-card.component';
import { PlaylistGridComponent } from './components/playlist-grid/playlist-grid.component';
import { PlaylistCardComponent } from './components/cards/playlist-card/playlist-card.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { AudioDetailsComponent } from './components/audio-details/audio-details.component';
import { GenreDetailsComponent } from './components/genre-details/genre-details.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { CatelogComponent } from './components/catelog/catelog.component';
import { CreatePlaylistModalComponent } from './components/modals/create-playlist-modal/create-playlist-modal.component';
import { AddPlaylistItemModalComponent } from './components/modals/add-playlist-item-modal/add-playlist-item-modal.component';
import { UploadsComponent } from './components/uploads/uploads.component';
import { UploadModalComponent } from './components/modals/upload-modal/upload-modal.component';
import { ChangePasswordModalComponent } from './components/modals/change-password-modal/change-password-modal.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NewsComponent } from './components/news/news.component';
import { VideosComponent } from './components/videos/videos.component';
import { ContentDashboardComponent } from './components/content-dashboard/content-dashboard.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    HeaderComponent,
    ProfileComponent,
    AudioCardComponent,
    VideoCardComponent,
    PodcastCardComponent,
    SidebarComponent,
    TopbarComponent,
    SectionHeaderComponent,
    TrackListComponent,
    PlaylistComponent,
    PodcastComponent,
    FavouritesComponent,
    RadioComponent,
    RadioCardComponent,
    PlaylistCardComponent,
    PlaylistGridComponent,
    PlaylistsComponent,
    AudioDetailsComponent,
    GenreDetailsComponent,
    MediaPlayerComponent,
    GenreCardComponent,
    PodcastDetailComponent,
    CatelogComponent,
    CreatePlaylistModalComponent,
    AddPlaylistItemModalComponent,
    UploadsComponent,
    UploadModalComponent,
    ChangePasswordModalComponent,
    RegisterComponent,
    LoginComponent,
    NotificationsComponent,
    NewsComponent,
    VideosComponent,
    ContentDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
     //NewsService,
    /*{
      /*provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi())*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
