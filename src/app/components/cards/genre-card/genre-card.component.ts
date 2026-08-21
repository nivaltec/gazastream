import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Genre } from 'src/app/models/genre';

@Component({
  selector: 'app-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrl: './genre-card.component.css',
  standalone: false,
})
export class GenreCardComponent {
  @Input()
  genre!: Genre;

  @Output()
  genreSelected = new EventEmitter<Genre>();

  selectGenre(): void {
    this.genreSelected.emit(this.genre);
  }
}
