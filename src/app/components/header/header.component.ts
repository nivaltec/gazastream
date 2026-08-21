import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone:false
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  email:string='';
  /*=========================================================
  SEARCH
  =========================================================*/

  searchText: string = '';

  /*=========================================================
  COUNTS
  =========================================================*/

  cartCount: number = 3;

  wishlistCount: number = 2;

  /*=========================================================
  MENUS
  =========================================================*/

  mobileMenuOpen = false;

  categoriesOpen = false;

  accountMenuOpen = false;

  sticky = false;

  constructor(
    private router: Router
  ) { }

  /*=========================================================
  INIT
  =========================================================*/

  ngOnInit(): void {

    this.loadCart();

    this.loadWishlist();

  }

  /*=========================================================
  DESTROY
  =========================================================*/

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

  /*=========================================================
  SEARCH
  =========================================================*/

  search(): void {

    const term = this.searchText.trim();

    if (!term) {
      return;
    }

    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: term
        }
      }
    );

    this.mobileMenuOpen = false;

  }

  /*=========================================================
  MENU TOGGLES
  =========================================================*/

  toggleMobileMenu(): void {

    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (this.mobileMenuOpen) {

      this.accountMenuOpen = false;

      this.categoriesOpen = false;

    }

  }

  toggleCategories(): void {

    this.categoriesOpen = !this.categoriesOpen;

    if (this.categoriesOpen) {

      this.accountMenuOpen = false;

    }

  }

  toggleAccountMenu(): void {

    this.accountMenuOpen = !this.accountMenuOpen;

    if (this.accountMenuOpen) {

      this.categoriesOpen = false;

    }

  }

  /*=========================================================
  CLOSE ALL MENUS
  =========================================================*/

  closeMenus(): void {

    this.mobileMenuOpen = false;

    this.categoriesOpen = false;

    this.accountMenuOpen = false;

  }

  /*=========================================================
  LOAD COUNTS
  =========================================================*/

  loadCart(): void {

    /**
     * Replace with CartService
     */

    this.cartCount = 3;

  }

  loadWishlist(): void {

    /**
     * Replace with WishlistService
     */

    this.wishlistCount = 2;

  }

  /*=========================================================
  LOGOUT
  =========================================================*/

  logout(): void {

    this.closeMenus();

    // TODO:
    // AuthService.logout();

    this.router.navigate(['/login']);

  }

  /*=========================================================
  SCROLL
  =========================================================*/

  @HostListener('window:scroll')

  onScroll(): void {

    this.sticky = window.pageYOffset > 120;

  }

  /*=========================================================
  ESC KEY
  =========================================================*/

  @HostListener('document:keydown.escape')

  onEscape(): void {

    this.closeMenus();

  }

  /*=========================================================
  CLICK OUTSIDE
  =========================================================*/

  @HostListener('document:click', ['$event'])

  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (
      !target.closest('.categories-dropdown') &&
      !target.closest('.account-menu') &&
      !target.closest('.account-dropdown') &&
      !target.closest('.mobile-menu') &&
      !target.closest('.mobile-menu-btn')
    ) {

      this.categoriesOpen = false;

      this.accountMenuOpen = false;

    }

  }

  /*=========================================================
  ROUTE HELPERS
  =========================================================*/

  goHome(): void {

    this.router.navigate(['/']);

  }

  goToCart(): void {

    this.router.navigate(['/cart']);

  }

  goToWishlist(): void {

    this.router.navigate(['/wishlist']);

  }

  goToProfile(): void {

    this.router.navigate(['/profile']);

  }

  subscribe(){
    
  }
  /*=========================================================
  CATEGORY
  =========================================================*/

  openCategory(category: string): void {

    this.categoriesOpen = false;

    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          category: category
        }
      }
    );

  }

  /*=========================================================
  CLEAR SEARCH
  =========================================================*/

  clearSearch(): void {

    this.searchText = '';

  }

  /*=========================================================
  REFRESH COUNTS
  =========================================================*/

  refresh(): void {

    this.loadCart();

    this.loadWishlist();

  }

}
