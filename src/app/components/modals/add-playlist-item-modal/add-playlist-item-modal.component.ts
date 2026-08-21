import {Component,EventEmitter,Input,OnDestroy,OnInit,Output,} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MediaItem } from 'src/app/models/media-item';
import { PlaylistService } from 'src/app/services/playlist-service';

@Component({
  selector: 'app-add-playlist-item-modal',
  templateUrl: './add-playlist-item-modal.component.html',
  styleUrls: ['./add-playlist-item-modal.component.css'],
  standalone: false,
})
export class AddPlaylistItemModalComponent implements OnInit, OnDestroy {
  // ============================================================
  // INPUTS
  // ============================================================

  @Input()
  playlistId: string | null = null;

  @Input()
  existingTrackIds: string[] = [];

  // ============================================================
  // OUTPUTS
  // ============================================================

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  itemAdded = new EventEmitter<MediaItem>();

  // ============================================================
  // STATE
  // ============================================================

  isLoading = false;

  isAdding = false;

  errorMessage = '';

  searchTerm = '';

  mediaItems: MediaItem[] = [];

  selectedItem: MediaItem | null = null;

  // ============================================================
  // DESTROY
  // ============================================================

  private readonly destroy$ = new Subject<void>();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private readonly playlistService: PlaylistService) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.loadMedia();
  }

  // ============================================================
  // CLOSE
  // ============================================================

  close(): void {
    if (this.isAdding) {
      return;
    }

    this.selectedItem = null;
    this.searchTerm = '';
    this.closed.emit();
  }

  // ============================================================
  // LOAD MEDIA
  // ============================================================

  private loadMedia(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.playlistService

      .getAvailableMedia()

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        // ======================================================
        // SUCCESS
        // ======================================================

        next: (items: MediaItem[]) => {
          this.mediaItems = items ?? [];
          this.isLoading = false;
        },

        // ======================================================
        // ERROR
        // ======================================================

        error: (error: any) => {
          this.mediaItems = [];
          this.errorMessage = 'Unable to load music. Please try again.';
          this.isLoading = false;
        },
      });
  }

  // ============================================================
  // FILTERED MEDIA
  // ============================================================

  get filteredItems(): MediaItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.mediaItems;
    }

    return this.mediaItems.filter((item) => {
      const title = item.title?.toLowerCase() ?? '';

      const artist = item.artist?.toLowerCase() ?? '';

      return title.includes(term) || artist.includes(term);
    });
  }

  // ============================================================
  // CHECK ALREADY ADDED
  // ============================================================

  isAlreadyAdded(item: MediaItem): boolean {
    if (!item?.id) {
      return false;
    }

    return this.existingTrackIds.includes(item.id);
  }

  // ============================================================
  // SELECT
  // ============================================================

  selectItem(item: MediaItem): void {
    if (!item || this.isAlreadyAdded(item)) {
      return;
    }
    this.selectedItem = item;
  }

  // ============================================================
  // ADD SELECTED ITEM
  // ============================================================

  addSelectedItem(): void {
    if (!this.playlistId || !this.selectedItem || this.isAdding) {
      return;
    }

    this.isAdding = true;

    this.errorMessage = '';

    const item = this.selectedItem;

    this.playlistService

      .addTrackToPlaylist(this.playlistId, item)

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        // ====================================================
        // SUCCESS
        // ====================================================

        next: () => {
          this.isAdding = false;
          this.itemAdded.emit(item);
        },

        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {
          this.isAdding = false;
          this.errorMessage = 'Unable to add this item to the playlist.';
        },
      });
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(index: number, item: MediaItem): string {
    return item.id;
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
