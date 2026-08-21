import {Component,EventEmitter,Input,OnDestroy,Output,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Playlist } from 'src/app/models/playlist';
import { PlaylistService } from 'src/app/services/playlist-service';

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrl: './create-playlist-modal.component.css',
  standalone: false
})
export class CreatePlaylistModalComponent implements OnDestroy {
  /* ============================================================
     VISIBILITY
     ============================================================ */

  private _visible = false;

  @Input()
  set visible(value: boolean) {
    this._visible = value;

    /*
     * When the modal is opened,
     * make sure stale errors/loading
     * don't remain visible.
     */

    if (value) {
      this.errorMessage = '';
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  /* ============================================================
     OUTPUTS
     ============================================================ */

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  created = new EventEmitter<Playlist>();

  /* ============================================================
     FORM
     ============================================================ */

  form: FormGroup;

  /* ============================================================
     STATE
     ============================================================ */

  isCreating = false;

  errorMessage = '';

  /* ============================================================
     ARTWORK
     ============================================================ */

  /*
   * Actual image file that will be uploaded.
   */

  artworkFile: File | null = null;

  /*
   * Temporary browser URL used
   * only for displaying the preview.
   */

  artworkPreview: string | null = null;

  /* ============================================================
     ALLOWED ARTWORK TYPES
     ============================================================ */

  private readonly allowedArtworkTypes = [
    'image/jpeg',

    'image/png',

    'image/webp',

    'image/gif',
  ];

  /* ============================================================
     MAX ARTWORK SIZE
     ============================================================ */

  private readonly maxArtworkSize = 5 * 1024 * 1024;

  /* ============================================================
     DESTROY
     ============================================================ */

  private readonly destroy$ = new Subject<void>();

  /* ============================================================
     CONSTRUCTOR
     ============================================================ */

  constructor(
    private readonly fb: FormBuilder,

    private readonly playlistService: PlaylistService,
  ) {
    this.form = this.fb.group({
      name: [
        '',

        [
          Validators.required,

          Validators.minLength(2),

          Validators.maxLength(100),
        ],
      ],

      description: ['', [Validators.maxLength(500)]],
    });
  }

  /* ============================================================
     GETTERS
     ============================================================ */

  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  /* ============================================================
     OPEN / CLOSE
     ============================================================ */

  close(): void {
    if (this.isCreating) {
      return;
    }

    this.closed.emit();
  }

  /* ============================================================
     ARTWORK SELECT
     ============================================================ */

  onArtworkSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validate file type.
     */

    if (!this.allowedArtworkTypes.includes(file.type)) {
      this.errorMessage = 'Please select a JPG, PNG, WEBP or GIF image.';

      /*
       * Clear input.
       */

      input.value = '';

      return;
    }

    /*
     * Validate file size.
     */

    if (file.size > this.maxArtworkSize) {
      this.errorMessage = 'Artwork must be smaller than 5 MB.';

      input.value = '';

      return;
    }

    /*
     * Remove previous preview.
     */

    this.revokeArtworkPreview();

    /*
     * Store the actual file.
     */

    this.artworkFile = file;

    /*
     * Create local preview.
     */

    this.artworkPreview = URL.createObjectURL(file);

    this.errorMessage = '';
  }

  /* ============================================================
     REMOVE ARTWORK
     ============================================================ */

  removeArtwork(): void {
    this.artworkFile = null;

    this.revokeArtworkPreview();

    this.artworkPreview = null;

    this.errorMessage = '';
  }

  /* ============================================================
     REVOKE ARTWORK PREVIEW
     ============================================================ */

  private revokeArtworkPreview(): void {
    if (this.artworkPreview) {
      URL.revokeObjectURL(this.artworkPreview);
    }
  }

  /* ============================================================
     CREATE PLAYLIST
     ============================================================ */

  create(): void {
    /*
     * Don't submit while another
     * request is running.
     */

    if (this.isCreating) {
      return;
    }

    /*
     * Validate form.
     */

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    /*
     * Get clean values.
     */

    const name = this.form.value.name?.trim();

    const description = this.form.value.description?.trim();

    /*
     * Extra protection.
     */

    if (!name) {
      this.nameControl?.setErrors({
        required: true,
      });

      this.nameControl?.markAsTouched();

      return;
    }

    /* ----------------------------------------------------------
       START REQUEST
       ---------------------------------------------------------- */

    this.isCreating = true;

    this.errorMessage = '';

    /* ----------------------------------------------------------
       FORM DATA
       ---------------------------------------------------------- */

    const formData = new FormData();

    /*
     * Playlist name.
     */

    formData.append('name', name);

    /*
     * Description is optional.
     */

    if (description) {
      formData.append('description', description);
    }

    /*
     * Artwork is optional.
     *
     * Only append it when the
     * user actually selected one.
     */

    if (this.artworkFile) {
      formData.append(
        'artwork',

        this.artworkFile,

        this.artworkFile.name,
      );
    }

    /* ----------------------------------------------------------
       CREATE
       ---------------------------------------------------------- */

    this.playlistService

      .createPlaylist(formData)

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        /* ------------------------------------------------------
           SUCCESS
           ------------------------------------------------------ */

        next: (createdPlaylist: Playlist) => {
          this.isCreating = false;

          /*
           * Tell the catalog component
           * that the playlist was created.
           */

          this.created.emit(createdPlaylist);

          /*
           * Reset the modal.
           */

          this.reset();
        },

        /* ------------------------------------------------------
           ERROR
           ------------------------------------------------------ */

        error: (error: any) => {
          console.error('Failed to create playlist:', error);

          this.isCreating = false;

          /*
           * Try to display a useful
           * API error if available.
           */

          this.errorMessage =
            error?.error?.message ??
            error?.error?.title ??
            'Unable to create playlist. Please try again.';
        },
      });
  }

  /* ============================================================
     RESET
     ============================================================ */

  reset(): void {
    /*
     * Reset form values and
     * validation state.
     */

    this.form.reset();

    /*
     * Clear artwork.
     */

    this.artworkFile = null;

    this.revokeArtworkPreview();

    this.artworkPreview = null;

    /*
     * Clear state.
     */

    this.errorMessage = '';

    this.isCreating = false;
  }

  /* ============================================================
     CANCEL
     ============================================================ */

  cancel(): void {
    if (this.isCreating) {
      return;
    }

    this.reset();

    this.closed.emit();
  }

  /* ============================================================
     ESCAPE KEY
     ============================================================ */

  onBackdropClick(event: MouseEvent): void {
    /*
     * Only close when the actual
     * backdrop was clicked.
     *
     * Clicking inside the modal
     * should do nothing.
     */

    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  /* ============================================================
     DESTROY
     ============================================================ */

  ngOnDestroy(): void {
    this.revokeArtworkPreview();

    this.destroy$.next();

    this.destroy$.complete();
  }
}
