import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UploadAudioType } from 'src/app/enums/upload-audio-type-enum';
import { UploadContentType } from 'src/app/enums/upload-content-type.-enum';
import { UploadStatus } from 'src/app/enums/upload-status-enum';
import { UploadAlbumTrack, UploadCompletedResult } from 'src/app/models/upload-media';
import { UploadService } from 'src/app/services/upload-service';


@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
  standalone: false,
})
export class UploadModalComponent implements OnDestroy {
  /* ==========================================================
     OUTPUTS
  ========================================================== */

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  uploadCompleted = new EventEmitter<UploadCompletedResult>();

  /* ==========================================================
     ENUMS
  ========================================================== */

  public readonly UploadContentType = UploadContentType;

  public readonly UploadAudioType = UploadAudioType;

  /* ==========================================================
     DESTROY
  ========================================================== */

  private readonly destroy$ = new Subject<void>();

  /* ==========================================================
     WIZARD
  ========================================================== */

  step = 1;

  selectedContentType: UploadContentType | null = null;

  isPodcast = false;

  /* ==========================================================
     AUDIO
  ========================================================== */

  audioType = UploadAudioType.Single;

  /* ==========================================================
     FORM
  ========================================================== */

  title = '';

  artist = '';

  album = '';

  description = '';

  genre = '';

  releaseDate = '';

  /* ==========================================================
     FILES
  ========================================================== */

  artworkFile: File | null = null;

  mediaFile: File | null = null;

  albumTracks: UploadAlbumTrack[] = [];

  /* ==========================================================
     UI
  ========================================================== */

  isDragging = false;

  isUploading = false;

  uploadProgress = 0;

  uploadStatus = UploadStatus.Pending;

  errorMessage = '';

  successMessage = '';

  /* ==========================================================
     INPUT IDS
  ========================================================== */

  artworkInputId = `gaza-artwork-input-${Date.now()}`;

  mediaInputId = `gaza-media-input-${Date.now()}`;

  albumInputId = `gaza-album-input-${Date.now()}`;

  /* ==========================================================
     CONSTRUCTOR
  ========================================================== */

  constructor(private readonly uploadService: UploadService) {
    document.body.classList.add('gaza-upload-modal-open');
  }

  /* ==========================================================
     CLOSE
  ========================================================== */

  close(): void {
    if (this.isUploading) {
      return;
    }

    this.closed.emit();
  }

  /* ==========================================================
     BACKDROP
  ========================================================== */

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isUploading) {
      this.close();
    }
  }

  /* ==========================================================
     SELECT CONTENT TYPE
  ========================================================== */

  selectContentType(type: UploadContentType): void {
    this.selectedContentType = type;
    this.errorMessage = '';
    this.step = 2;
  }

  /* ==========================================================
     CONTENT TYPE LABEL
  ========================================================== */

  get contentTypeLabel(): string {
    if (this.selectedContentType === UploadContentType.Audio) {
      return this.isPodcast ? 'Audio Podcast' : 'Audio';
    }

    if (this.selectedContentType === UploadContentType.Video) {
      return this.isPodcast ? 'Video Podcast' : 'Video';
    }

    return 'Upload';
  }

  /* ==========================================================
     NEXT
  ========================================================== */

  next(): void {
    this.errorMessage = '';

    if (!this.validateCurrentStep()) {
      return;
    }

    this.step++;
  }

  /* ==========================================================
     BACK
  ========================================================== */

  back(): void {
    if (this.isUploading) {
      return;
    }

    if (this.step > 1) {
      this.step--;
      return;
    }

    this.close();
  }

  /* ==========================================================
     VALIDATE CURRENT STEP
  ========================================================== */

  private validateCurrentStep(): boolean {
    if (this.step === 1) {
      if (!this.selectedContentType) {
        this.errorMessage = 'Please select what you want to upload.';

        return false;
      }
    }

    if (this.step === 2) {
      if (!this.title.trim()) {
        this.errorMessage = 'Please enter a title.';

        return false;
      }
    }

    if (this.step === 3) {
      if (this.selectedContentType === UploadContentType.Audio) {
        if (this.audioType === UploadAudioType.Album) {
          if (!this.albumTracks.length) {
            this.errorMessage = 'Please add at least one album track.';

            return false;
          }
        } else if (!this.mediaFile) {
          this.errorMessage = 'Please select an audio file.';

          return false;
        }
      }

      if (this.selectedContentType === UploadContentType.Video) {
        if (!this.mediaFile) {
          this.errorMessage = 'Please select a video file.';

          return false;
        }
      }
    }

    return true;
  }

  /* ==========================================================
     ARTWORK
  ========================================================== */

  onArtworkSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.isImage(file)) {
      this.errorMessage = 'Artwork must be JPG, PNG or WEBP.';

      return;
    }

    this.artworkFile = file;
    this.errorMessage = '';
  }

  /* ==========================================================
     MEDIA
  ========================================================== */

  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.validateMediaFile(file)) {
      return;
    }

    this.mediaFile = file;
    this.errorMessage = '';
  }

  /* ==========================================================
     ALBUM FILES
  ========================================================== */

  onAlbumFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const files = Array.from(input.files ?? []);

    if (!files.length) {
      return;
    }

    this.addAlbumFiles(files);

    input.value = '';
  }

  /* ==========================================================
     ADD ALBUM FILES
  ========================================================== */

  private addAlbumFiles(files: File[]): void {
    for (const file of files) {
      if (!this.isAudio(file)) {
        this.errorMessage = `${file.name} is not a supported audio file.`;

        continue;
      }

      this.albumTracks.push({
        id: this.createId(),
        file,
        title: this.removeExtension(file.name),
        trackNumber: this.albumTracks.length + 1,
        status: UploadStatus.Pending,
        progress: 0,
      });
    }

    this.renumberTracks();
  }

  /* ==========================================================
     REMOVE TRACK
  ========================================================== */

  removeAlbumTrack(trackId: string): void {
    this.albumTracks = this.albumTracks.filter((track) => track.id !== trackId);

    this.renumberTracks();
  }

  /* ==========================================================
     MOVE TRACK UP
  ========================================================== */

  moveTrackUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const tracks = [...this.albumTracks];

    [tracks[index - 1], tracks[index]] = [tracks[index], tracks[index - 1]];

    this.albumTracks = tracks;

    this.renumberTracks();
  }

  /* ==========================================================
     MOVE TRACK DOWN
  ========================================================== */

  moveTrackDown(index: number): void {
    if (index >= this.albumTracks.length - 1) {
      return;
    }

    const tracks = [...this.albumTracks];

    [tracks[index], tracks[index + 1]] = [tracks[index + 1], tracks[index]];

    this.albumTracks = tracks;

    this.renumberTracks();
  }

  /* ==========================================================
     RENUMBER TRACKS
  ========================================================== */

  private renumberTracks(): void {
    this.albumTracks = this.albumTracks.map((track, index) => ({
      ...track,
      trackNumber: index + 1,
    }));
  }

  /* ==========================================================
     DRAG & DROP
  ========================================================== */

  onDragEnter(event: DragEvent): void {
    event.preventDefault();

    this.isDragging = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();

    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    this.isDragging = false;

    const files = Array.from(event.dataTransfer?.files ?? []);

    if (!files.length) {
      return;
    }

    if (
      this.selectedContentType === UploadContentType.Audio &&
      this.audioType === UploadAudioType.Album
    ) {
      this.addAlbumFiles(files);

      return;
    }

    const file = files[0];

    if (this.validateMediaFile(file)) {
      this.mediaFile = file;
    }
  }

  /* ==========================================================
     UPLOAD
  ========================================================== */

  upload(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateCurrentStep()) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadStatus = UploadStatus.Uploading;

    const data = this.buildUploadData();

    const request$ =
      this.selectedContentType === UploadContentType.Audio
        ? this.audioType === UploadAudioType.Album
          ? this.uploadService.uploadAlbum(data)
          : this.uploadService.uploadAudio(data)
        : this.uploadService.uploadVideo(data);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: any) => {
        this.uploadProgress = result.progress ?? 0;

        this.uploadStatus = result.status;

        if (result.status === UploadStatus.Completed) {
          this.isUploading = false;

          this.uploadProgress = 100;

          this.successMessage =
            result.message ?? 'Your content was uploaded successfully.';

          this.uploadCompleted.emit(this.buildCompletedUpload());

          this.step = 5;
        }
      },

      error: (error: unknown) => {
        console.error('Gaza Stream upload failed:', error);

        this.isUploading = false;

        this.uploadStatus = UploadStatus.Failed;

        this.uploadProgress = 0;

        this.errorMessage = 'Upload failed. Please try again.';
      },
    });
  }

  /* ==========================================================
     BUILD UPLOAD DATA
  ========================================================== */

  private buildUploadData(): any {
    return {
      contentType: this.selectedContentType!,

      isPodcast: this.isPodcast,

      audioType:
        this.selectedContentType === UploadContentType.Audio
          ? this.audioType
          : undefined,

      title: this.title.trim(),

      artist: this.artist.trim(),

      album: this.album.trim(),

      description: this.description.trim(),

      genre: this.genre.trim(),

      releaseDate: this.releaseDate,

      artwork: this.artworkFile,

      mediaFile: this.mediaFile,

      tracks: this.albumTracks,
    };
  }

  /* ==========================================================
     BUILD COMPLETED RESULT
  ========================================================== */

  private buildCompletedUpload(): UploadCompletedResult {
    return {
      id: this.createId(),

      title: this.title.trim(),

      artist: this.artist.trim(),

      album: this.album.trim(),

      genre: this.genre.trim(),

      description: this.description.trim(),

      contentType: this.selectedContentType!,

      isPodcast: this.isPodcast,

      audioType:
        this.selectedContentType === UploadContentType.Audio
          ? this.audioType
          : undefined,

      fileName: this.mediaFile?.name,

      trackCount: this.albumTracks.length || undefined,

      status: UploadStatus.Completed,

      progress: 100,

      createdAt: new Date(),
    };
  }

  /* ==========================================================
     UPLOAD MORE
  ========================================================== */

  uploadMore(): void {
    this.resetWizard();

    this.step = 1;
  }

  /* ==========================================================
     RESET
  ========================================================== */

  resetWizard(): void {
    this.step = 1;

    this.selectedContentType = null;

    this.isPodcast = false;

    this.audioType = UploadAudioType.Single;

    this.title = '';

    this.artist = '';

    this.album = '';

    this.description = '';

    this.genre = '';

    this.releaseDate = '';

    this.artworkFile = null;

    this.mediaFile = null;

    this.albumTracks = [];

    this.isDragging = false;

    this.isUploading = false;

    this.uploadProgress = 0;

    this.uploadStatus = UploadStatus.Pending;

    this.errorMessage = '';

    this.successMessage = '';
  }

  /* ==========================================================
     VALIDATE MEDIA
  ========================================================== */

  private validateMediaFile(file: File): boolean {
    if (
      this.selectedContentType === UploadContentType.Audio &&
      !this.isAudio(file)
    ) {
      this.errorMessage = 'Please select a valid audio file.';

      return false;
    }

    if (
      this.selectedContentType === UploadContentType.Video &&
      !this.isVideo(file)
    ) {
      this.errorMessage = 'Please select a valid video file.';

      return false;
    }

    return true;
  }

  /* ==========================================================
     FILE HELPERS
  ========================================================== */

  private isAudio(file: File): boolean {
    return (
      file.type.startsWith('audio/') ||
      /\.(mp3|wav|m4a|aac|flac|ogg)$/i.test(file.name)
    );
  }

  private isVideo(file: File): boolean {
    return (
      file.type.startsWith('video/') ||
      /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name)
    );
  }

  private isImage(file: File): boolean {
    return (
      file.type.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );
  }

  private removeExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '');
  }

  private createId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /* ==========================================================
     TRACK BY
  ========================================================== */

  trackByTrackId(_index: number, track: UploadAlbumTrack): string {
    return track.id;
  }

  /* ==========================================================
     DESTROY
  ========================================================== */

  ngOnDestroy(): void {
    document.body.classList.remove('gaza-upload-modal-open');

    this.destroy$.next();

    this.destroy$.complete();
  }
}
