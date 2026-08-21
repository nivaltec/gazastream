import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-card',
  templateUrl: './radio-card.component.html',
  styleUrls: ['./radio-card.component.css'],
  standalone: false,
})
export class RadioCardComponent {
  @Input() station: any;

  @Input() playing = false;

  @Output() play = new EventEmitter<any>();

  onPlay(event: Event): void {
    event.stopPropagation();

    this.play.emit(this.station);
  }

  onCardClick(): void {
    this.play.emit(this.station);
  }
}
