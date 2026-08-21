import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false,
})
export class RegisterComponent {
  firstName = '';

  lastName = '';

  email = '';

  password = '';

  confirmPassword = '';

  acceptTerms = false;

  showPassword = false;

  showConfirmPassword = false;

  loading = false;

  errorMessage = '';

  successMessage = '';

  readonly currentYear = new Date().getFullYear();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /* ============================================================
     REGISTER
     ============================================================ */

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const firstName = this.firstName.trim();

    const lastName = this.lastName.trim();

    const email = this.email.trim();

    if (!firstName) {
      this.errorMessage = 'Please enter your first name.';

      return;
    }

    if (!lastName) {
      this.errorMessage = 'Please enter your last name.';

      return;
    }

    if (!email) {
      this.errorMessage = 'Please enter your email address.';

      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address.';

      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please create a password.';

      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Your password must contain at least 8 characters.';

      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Your passwords do not match.';

      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Please accept the Terms and Privacy Policy.';

      return;
    }

    this.loading = true;

    this.authService
      .register({
        firstName,
        lastName,
        email,
        password: this.password,
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
            'Unable to create your account. Please try again.';
        },
      });
  }

  /* ============================================================
     GOOGLE
     ============================================================ */

  registerWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  /* ============================================================
     FACEBOOK
     ============================================================ */

  registerWithFacebook(): void {
    this.authService.loginWithFacebook();
  }

  /* ============================================================
     APPLE
     ============================================================ */

  registerWithApple(): void {
    this.authService.loginWithApple();
  }

  /* ============================================================
     PASSWORD
     ============================================================ */

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /* ============================================================
     PASSWORD STRENGTH
     ============================================================ */

  get passwordStrength(): number {
    if (!this.password) {
      return 0;
    }

    let strength = 0;

    if (this.password.length >= 8) {
      strength++;
    }

    if (/[A-Z]/.test(this.password)) {
      strength++;
    }

    if (/[a-z]/.test(this.password)) {
      strength++;
    }

    if (/[0-9]/.test(this.password)) {
      strength++;
    }

    if (/[^A-Za-z0-9]/.test(this.password)) {
      strength++;
    }

    return strength;
  }

  get passwordStrengthLabel(): string {
    switch (this.passwordStrength) {
      case 1:
        return 'Very weak';

      case 2:
        return 'Weak';

      case 3:
        return 'Good';

      case 4:
        return 'Strong';

      case 5:
        return 'Very strong';

      default:
        return '';
    }
  }

  /* ============================================================
     LOGIN
     ============================================================ */

  login(): void {
    this.router.navigate(['/login']);
  }

  /* ============================================================
     EMAIL
     ============================================================ */

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
