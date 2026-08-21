import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css',
  standalone:false
})
export class SectionHeaderComponent {
    @Input() title = '';

  @Input() subtitle = '';

  @Input() linkText = '';

  @Input() linkUrl = '';
}
