import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  standalone: false
})
export class ContactComponent {


  @Output()
  close = new EventEmitter<void>();



  constructor(
    private router: Router
  ) {}



  closeModal(){

    this.close.emit();

  }



  applyNow(){

    this.router.navigate([
      '/apply'
    ]);

  }


}