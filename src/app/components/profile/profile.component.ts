import {Component,ElementRef,ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { UserProfile } from 'src/app/models/user-profile';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: false
})
export class ProfileComponent {

  /* ==========================================================
     PROFILE IMAGE INPUT
     ========================================================== */

  @ViewChild('profileImageInput')
  private profileImageInput?: ElementRef<HTMLInputElement>;


  /* ==========================================================
     EDIT STATE
     ========================================================== */

  isEditing = false;


  /* ==========================================================
     CHANGE PASSWORD
     ========================================================== */

  isChangePasswordOpen = false;


  /* ==========================================================
     PROFILE IMAGE
     ========================================================== */

  profileImageUrl: string | null = null;

  private originalProfileImageUrl: string | null = null;


  /* ==========================================================
     USER
     ========================================================== */

  user: UserProfile = {

    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',

    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',

    bankName: '',
    accountHolder: '',
    accountNumber: '',
    branchCode: ''
  };


  /**
   * Snapshot used when cancelling edit mode.
   */
  private originalUser: UserProfile = {
    ...this.user
  };


  constructor(
    private readonly router: Router
  ) {}


  /* ==========================================================
     EDIT PROFILE
     ========================================================== */

  startEditing(): void {

    this.originalUser = {
      ...this.user
    };

    this.originalProfileImageUrl =
      this.profileImageUrl;

    this.isEditing = true;
  }


  /* ==========================================================
     SAVE PROFILE
     ========================================================== */

  saveProfile(): void {

    if (!this.isEditing) {
      return;
    }

    /*
     * TODO:
     * Send the updated profile to your API here.
     *
     * Example:
     *
     * this.userService.updateProfile(this.user)
     *   .subscribe(...)
     */

    this.originalUser = {
      ...this.user
    };

    this.originalProfileImageUrl =
      this.profileImageUrl;

    this.isEditing = false;
  }


  /* ==========================================================
     CANCEL EDITING
     ========================================================== */

  cancelEditing(): void {

    if (!this.isEditing) {
      return;
    }

    this.user = {
      ...this.originalUser
    };

    this.profileImageUrl =
      this.originalProfileImageUrl;

    this.isEditing = false;

    /*
     * Clear the file input so selecting the same image again
     * will trigger the change event.
     */

    this.clearProfileImageInput();
  }


  /* ==========================================================
     PROFILE IMAGE
     ========================================================== */

  openProfileImagePicker(): void {

    /*
     * IMPORTANT:
     *
     * The image can ONLY be changed while editing.
     */

    if (!this.isEditing) {
      return;
    }

    this.profileImageInput
      ?.nativeElement
      .click();
  }


  onProfileImageSelected(
    event: Event
  ): void {

    /*
     * Extra protection.
     *
     * Even if the file input somehow triggers while the
     * profile is locked, do nothing.
     */

    if (!this.isEditing) {
      this.clearProfileImageInput();
      return;
    }


    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file) {
      return;
    }


    /*
     * Only allow supported image types.
     */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];


    if (!allowedTypes.includes(file.type)) {

      this.clearProfileImageInput();

      return;
    }


    /*
     * Optional size protection.
     * 5 MB maximum.
     */

    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      this.clearProfileImageInput();

      return;
    }


    /*
     * Create a temporary preview.
     *
     * The actual upload should happen when Save Changes
     * is clicked.
     */

    const reader =
      new FileReader();


    reader.onload = () => {

      if (!this.isEditing) {
        return;
      }

      this.profileImageUrl =
        reader.result as string;
    };


    reader.readAsDataURL(file);
  }


  private clearProfileImageInput(): void {

    if (this.profileImageInput) {

      this.profileImageInput
        .nativeElement
        .value = '';

    }
  }


  /* ==========================================================
     CHANGE PASSWORD
     ========================================================== */

  openChangePassword(): void {

    this.isChangePasswordOpen = true;
  }


  closeChangePassword(): void {

    this.isChangePasswordOpen = false;
  }


  onPasswordChanged(): void {

    this.isChangePasswordOpen = false;
  }


}
