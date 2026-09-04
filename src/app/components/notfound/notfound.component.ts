import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: false,
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css'],
})
export class NotFoundComponent implements OnInit {


  constructor(
    private readonly router: Router
  ) {}

   ngOnInit(): void
   {
      localStorage.setItem("notfound","true");
   }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }

}
