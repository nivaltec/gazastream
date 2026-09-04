import { Component, OnDestroy } from '@angular/core';
import { LibraryMenu } from 'src/app/enums/library-menu';
import { sideBarMenu } from 'src/app/enums/sidebar-menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: false,
})
export class SidebarComponent implements OnDestroy {
  mobileMenuOpen = false;
  navigation = sideBarMenu;
  isAuthenticated = false ;

  readonly libraryLists = LibraryMenu;

  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    this.updateBodyScroll();
  }

  /* ============================================================
     CLOSE MOBILE SIDEBAR
     ============================================================ */

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;

    this.updateBodyScroll();
  }

  /* ============================================================
     BODY SCROLL
     ============================================================ */

  private updateBodyScroll(): void {
    if (this.mobileMenuOpen) {
      document.body.classList.add('gaza-sidebar-open');
    } else {
      document.body.classList.remove('gaza-sidebar-open');
    }
  }

  /* ============================================================
     CLEANUP
     ============================================================ */

  ngOnDestroy(): void {
    document.body.classList.remove('gaza-sidebar-open');
  }
}
