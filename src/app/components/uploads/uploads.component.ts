import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UploadAudioType } from 'src/app/enums/upload-audio-type-enum';
import { UploadContentType } from 'src/app/enums/upload-content-type.-enum';
import { UploadStatus } from 'src/app/enums/upload-status-enum';
import { UploadService } from 'src/app/services/upload-service';

interface UploadListItem {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  contentType: UploadContentType;
  isPodcast: boolean;
  audioType?: UploadAudioType;
  artwork?: string;
  trackCount?: number;
  status: UploadStatus;
  progress: number;
  createdAt: Date | string;
}

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css'],
  standalone: false,
})
export class UploadsComponent implements OnInit, OnDestroy {
  // ============================================================
  // TEMPLATE ENUMS
  // ============================================================

  readonly UploadAudioType = UploadAudioType;
  readonly UploadStatus = UploadStatus;
  readonly UploadContentType = UploadContentType;

  // ============================================================
  // STATE
  // ============================================================

  uploads: UploadListItem[] = [];

  isLoadingUploads = false;

  searchTerm = '';

  filter: 'all' | 'audio' | 'video' | 'podcast' = 'all';

  isUploadModalOpen = false;

  // ============================================================
  // PRIVATE
  // ============================================================

  private readonly destroy$ = new Subject<void>();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private readonly uploadService: UploadService) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.loadUploads();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // LOAD
  // ============================================================

  private loadUploads(): void {
    this.isLoadingUploads = true;

    this.uploadService
      .getUploads()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (uploads: UploadListItem[]) => {
          this.uploads = uploads ?? [];
          this.isLoadingUploads = false;
        },

        error: (error: unknown) => {
          console.error('Failed to load uploads:', error);
          this.uploads = [];
          this.isLoadingUploads = false;
        },
      });
  }

  // ============================================================
  // MODAL
  // ============================================================

  openUploadModal(): void {
    this.isUploadModalOpen = true;
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
  }

  onUploadCompleted(upload: UploadListItem): void {
    this.uploads = [upload, ...this.uploads];

    this.closeUploadModal();
  }

  // ============================================================
  // FILTER
  // ============================================================

  setFilter(filter: 'all' | 'audio' | 'video' | 'podcast'): void {
    this.filter = filter;
  }

  // ============================================================
  // FILTERED UPLOADS
  // ============================================================

  get filteredUploads(): UploadListItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.uploads.filter((upload) => {
      if (
        this.filter === 'audio' &&
        upload.contentType !== UploadContentType.Audio
      ) {
        return false;
      }

      if (
        this.filter === 'video' &&
        upload.contentType !== UploadContentType.Video
      ) {
        return false;
      }

      if (this.filter === 'podcast' && !upload.isPodcast) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [upload.title, upload.artist, upload.album]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search));
    });
  }

  // ============================================================
  // COUNTS
  // ============================================================

  get uploadCount(): number {
    return this.uploads.length;
  }

  get podcastCount(): number {
    return this.uploads.filter((upload) => upload.isPodcast).length;
  }

  get audioCount(): number {
    return this.uploads.filter(
      (upload) => upload.contentType === UploadContentType.Audio,
    ).length;
  }

  get videoCount(): number {
    return this.uploads.filter(
      (upload) => upload.contentType === UploadContentType.Video,
    ).length;
  }

  // ============================================================
  // DISPLAY
  // ============================================================

  getUploadIcon(upload: UploadListItem): string {
    if (upload.isPodcast) {
      return upload.contentType === UploadContentType.Video
        ? 'fa-video'
        : 'fa-microphone-lines';
    }

    return upload.contentType === UploadContentType.Video
      ? 'fa-video'
      : 'fa-music';
  }

  getUploadTypeLabel(upload: UploadListItem): string {
    if (upload.isPodcast) {
      return upload.contentType === UploadContentType.Video
        ? 'Video Podcast'
        : 'Audio Podcast';
    }

    return upload.contentType === UploadContentType.Video ? 'Video' : 'Audio';
  }

  formatDate(date: Date | string): string {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  // ============================================================
  // TRACKING
  // ============================================================

  trackByUploadId(index: number, upload: UploadListItem): string {
    return upload.id;
  }
}
