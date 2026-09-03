
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { AuthService } from 'src/app/services/auth-service';


export interface TopbarUser {

  id?: string;

  displayName?: string;

  username?: string;

  email?: string;

  role?: string;

  profileImageUrl?: string;

  isAuthenticated: boolean;
}


@Component({
  selector: 'app-topbar',

  templateUrl: './topbar.component.html',

  styleUrl: './topbar.component.css',

  standalone: false,
})
export class TopbarComponent implements OnInit, OnDestroy {


  /* ==========================================================
     SEARCH
     ========================================================== */

  searchTerm = '';


  /* ==========================================================
     PROFILE
     ========================================================== */

  isProfileOpen = false;


  /* ==========================================================
     USER
     ========================================================== */

  user: TopbarUser = {

    isAuthenticated: false,

  };


  /* ==========================================================
     NOTIFICATIONS
     ========================================================== */

  notificationCount = 4;


  /* ==========================================================
     DESTROY
     ========================================================== */

  private readonly destroy$ =
    new Subject<void>();


  /* ==========================================================
     CONSTRUCTOR
     ========================================================== */

  constructor(

    private readonly router: Router,

    private readonly authService: AuthService,

  ) {}


  /* ==========================================================
     INIT
     ========================================================== */

  ngOnInit(): void {

    /* --------------------------------------------------------
       AUTHENTICATED USER
       -------------------------------------------------------- */

    this.authService.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (user) => {

          /* --------------------------------------------------
             NO USER
             -------------------------------------------------- */

          if (!user) {

            this.user = {

              isAuthenticated: false,

            };

            return;

          }


          /* --------------------------------------------------
             USER FOUND
             -------------------------------------------------- */

          this.user = {

            ...user,

            isAuthenticated: true,

          };

        },

        error: (error) => {

          console.error(
            'Failed to load authenticated user:',
            error
          );

          this.user = {

            isAuthenticated: false,

          };

        },

      });

  }


  /* ==========================================================
     DESTROY
     ========================================================== */

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }


  /* ==========================================================
     USER DISPLAY
     ========================================================== */

  get displayName(): string {

    /* --------------------------------------------------------
       DISPLAY NAME
       -------------------------------------------------------- */

    if (
      this.user.displayName?.trim()
    ) {

      return this.user.displayName.trim();

    }


    /* --------------------------------------------------------
       USERNAME
       -------------------------------------------------------- */

    if (
      this.user.username?.trim()
    ) {

      return this.user.username.trim();

    }


    /* --------------------------------------------------------
       EMAIL
       -------------------------------------------------------- */

    if (
      this.user.email?.trim()
    ) {

      return this.user.email
        .split('@')[0]
        .trim();

    }


    /* --------------------------------------------------------
       DEFAULT
       -------------------------------------------------------- */

    return 'Listener';

  }


  /* ==========================================================
     USER SUBTITLE
     ========================================================== */

  get userSubtitle(): string {

    /* --------------------------------------------------------
       ROLE
       -------------------------------------------------------- */

    if (
      this.user.role?.trim()
    ) {

      return this.user.role.trim();

    }


    /* --------------------------------------------------------
       EMAIL
       -------------------------------------------------------- */

    if (
      this.user.email?.trim()
    ) {

      return this.user.email.trim();

    }


    /* --------------------------------------------------------
       DEFAULT
       -------------------------------------------------------- */

    return 'Music lover';

  }


  /* ==========================================================
     PROFILE IMAGE
     ========================================================== */

  get hasProfileImage(): boolean {

    return !!this.user.profileImageUrl?.trim();

  }


  /* ==========================================================
     SEARCH
     ========================================================== */

  search(): void {

    const query =
      this.searchTerm.trim();


    /* --------------------------------------------------------
       EMPTY SEARCH
       -------------------------------------------------------- */

    if (!query) {

      return;

    }


    /* --------------------------------------------------------
       CLOSE PROFILE
       -------------------------------------------------------- */

    this.closeProfileMenu();


    /* --------------------------------------------------------
       NAVIGATE
       -------------------------------------------------------- */

    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          q: query,
        },
      }
    );

  }


  /* ==========================================================
     CLEAR SEARCH
     ========================================================== */

  clearSearch(): void {

    this.searchTerm = '';

  }


  /* ==========================================================
     SEARCH KEYBOARD
     ========================================================== */

  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    /* --------------------------------------------------------
       ENTER
       -------------------------------------------------------- */

    if (
      event.key === 'Enter'
    ) {

      event.preventDefault();

      this.search();

      return;

    }


    /* --------------------------------------------------------
       ESCAPE
       -------------------------------------------------------- */

    if (
      event.key === 'Escape'
    ) {

      if (this.searchTerm) {

        this.clearSearch();

      }

    }

  }


  /* ==========================================================
     PROFILE MENU
     ========================================================== */

  toggleProfileMenu(): void {

    this.isProfileOpen =
      !this.isProfileOpen;

  }


  /* ==========================================================
     CLOSE PROFILE MENU
     ========================================================== */

  closeProfileMenu(): void {

    this.isProfileOpen = false;

  }


  /* ==========================================================
     VIEW PROFILE
     ========================================================== */

  viewProfile(): void {

    this.closeProfileMenu();

    this.router.navigate(
      ['/profile']
    );

  }


  /* ==========================================================
     NOTIFICATIONS
     ========================================================== */

  openNotifications(): void {

    this.router.navigate(
      ['/notifications']
    );

  }


  /* ==========================================================
     LOGOUT
     ========================================================== */

  logout(): void {

    this.closeProfileMenu();

    this.authService.logout();

  }


  /* ==========================================================
     MOBILE MENU
     ========================================================== */

  openMobileMenu(): void {

    window.dispatchEvent(
      new CustomEvent(
        'gaza-mobile-menu-toggle'
      )
    );

  }


  /* ==========================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
     ========================================================== */

  @HostListener(
    'document:click',
    ['$event']
  )

  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest(
        '.gaza-profile'
      )
    ) {

      this.closeProfileMenu();

    }

  }


  /* ==========================================================
     ESCAPE
     ========================================================== */

  @HostListener(
    'document:keydown.escape'
  )

  onEscape(): void {

    this.closeProfileMenu();

  }

}

