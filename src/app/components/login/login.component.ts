import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false,
})
export class LoginComponent {
  email = '';

  password = '';

  rememberMe = true;

  showPassword = false;

  loading = false;

  errorMessage = '';

  successMessage = '';
  currentYear: any = new Date().getFullYear();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /* ============================================================
     LOGIN
     ============================================================ */

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.email.trim();

    if (!email) {
      this.errorMessage = 'Please enter your email address.';

      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address.';

      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password.';

      return;
    }

    this.loading = true;

    this.authService
      .login({
        email,
        password: this.password,
        rememberMe: this.rememberMe,
      })
      .subscribe({
        next: () => {
          this.loading = false;

          this.router.navigate(['/']);
        },

        error: (error) => {
          this.loading = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to sign in. Please check your email and password.';
        },
      });
  }

  /* ============================================================
     GOOGLE
     ============================================================ */

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  /* ============================================================
     FACEBOOK
     ============================================================ */

  loginWithFacebook(): void {
    this.authService.loginWithFacebook();
  }

  /* ============================================================
     APPLE
     ============================================================ */

  loginWithApple(): void {
    this.authService.loginWithApple();
  }

  /* ============================================================
     PASSWORD
     ============================================================ */

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /* ============================================================
     FORGOT PASSWORD
     ============================================================ */

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  /* ============================================================
     REGISTER
     ============================================================ */

  register(): void {
    this.router.navigate(['/register']);
  }

  /* ============================================================
     VALIDATE EMAIL
     ============================================================ */

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
