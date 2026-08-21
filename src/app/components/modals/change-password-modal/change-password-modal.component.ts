import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css',
  standalone:false
})
export class ChangePasswordModalComponent {

  @Output() closed = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<void>();

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isSaving = false;

  errorMessage = '';
  successMessage = '';

  get passwordsMatch(): boolean {
    return (
      !!this.newPassword &&
      !!this.confirmPassword &&
      this.newPassword === this.confirmPassword
    );
  }

  get hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  get hasSpecialCharacter(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }

  get isStrongPassword(): boolean {
    return (
      this.hasMinLength &&
      this.hasUppercase &&
      this.hasLowercase &&
      this.hasNumber &&
      this.hasSpecialCharacter
    );
  }

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword) {
      this.errorMessage = 'Please enter your current password.';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    if (!this.isStrongPassword) {
      this.errorMessage =
        'Your new password does not meet all the security requirements.';
      return;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Please confirm your new password.';
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'The passwords do not match.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.errorMessage =
        'Your new password must be different from your current password.';
      return;
    }

    this.isSaving = true;

    /*
     * Replace this section with your authentication service.
     *
     * Example:
     *
     * this.authService.changePassword({
     *   currentPassword: this.currentPassword,
     *   newPassword: this.newPassword
     * }).subscribe({
     *   next: () => this.handleSuccess(),
     *   error: () => this.handleError()
     * });
     */

    setTimeout(() => {
      this.isSaving = false;

      this.successMessage = 'Your password has been changed successfully.';

      this.passwordChanged.emit();

      setTimeout(() => {
        this.close();
      }, 1200);

    }, 800);
  }

  getPasswordStrength(): number {
    let strength = 0;

    if (this.hasMinLength) {
      strength++;
    }

    if (this.hasUppercase) {
      strength++;
    }

    if (this.hasLowercase) {
      strength++;
    }

    if (this.hasNumber) {
      strength++;
    }

    if (this.hasSpecialCharacter) {
      strength++;
    }

    return strength;
  }
}
