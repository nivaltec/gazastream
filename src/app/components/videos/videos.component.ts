import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-videos',
  standalone: false,
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css',
})
export class VideosComponent implements OnInit {

  /* ==========================================================
     DATA
     ========================================================== */

  videos: any[] = [];

  pagedVideos: any[] = [];


  /* ==========================================================
     PAGINATION
     ========================================================== */

  currentPage = 1;

  pageSize = 12;

  totalVideos = 0;

  totalPages = 0;

  pages: number[] = [];


  /* ==========================================================
     STATE
     ========================================================== */

  isLoading = false;


  /* ==========================================================
     INIT
     ========================================================== */

  ngOnInit(): void {

    this.loadVideos();

  }


  /* ==========================================================
     LOAD VIDEOS
     ========================================================== */

  private loadVideos(): void {

    this.isLoading = true;

    /*
     * Internet video data.
     *
     * These are real publicly available YouTube videos.
     *
     * The thumbnail URL is generated from the YouTube video ID.
     */

    this.videos = [

      {
        id: 'maxYQn011i4',
        title: 'MC Gaza - Grime From Gaza',
        description:
          'A Gaza-based Palestinian rap performance filmed during the Great Return March.',
        thumbnail:
          'https://img.youtube.com/vi/maxYQn011i4/hqdefault.jpg',
        videoUrl:
          'https://www.youtube.com/watch?v=maxYQn011i4',
        url:
          'https://www.youtube.com/watch?v=maxYQn011i4',
        type: 'video',
        category: 'Music',
        artist: 'MC Gaza',
      },

      {
        id: 'WgzUvbI7pj0',
        title:
          'Dammi Falastini - Mohammed Assaf',
        description:
          'Mohammed Assaf performing Dammi Falastini with English transliteration and translation.',
        thumbnail:
          'https://img.youtube.com/vi/WgzUvbI7pj0/hqdefault.jpg',
        videoUrl:
          'https://www.youtube.com/watch?v=WgzUvbI7pj0',
        url:
          'https://www.youtube.com/watch?v=WgzUvbI7pj0',
        type: 'video',
        category: 'Music',
        artist: 'Mohammed Assaf',
      },

      {
        id: 'F9czNtvvgvA',
        title:
          'Mohammed Assaf - Dammi Falastini',
        description:
          'Mohammed Assaf performing the Palestinian classic Dammi Falastini.',
        thumbnail:
          'https://img.youtube.com/vi/F9czNtvvgvA/hqdefault.jpg',
        videoUrl:
          'https://www.youtube.com/watch?v=F9czNtvvgvA',
        url:
          'https://www.youtube.com/watch?v=F9czNtvvgvA',
        type: 'video',
        category: 'Music',
        artist: 'Mohammed Assaf',
      },

      {
        id: 'arSHRKBXOxU',
        title:
          'Today We Sing - Project Zouqaq',
        description:
          'A music project showcasing young musicians and singers from Gaza.',
        thumbnail:
          'https://img.youtube.com/vi/arSHRKBXOxU/hqdefault.jpg',
        videoUrl:
          'https://www.youtube.com/watch?v=arSHRKBXOxU',
        url:
          'https://www.youtube.com/watch?v=arSHRKBXOxU',
        type: 'video',
        category: 'Music',
        artist: 'Project Zouqaq',
      },

      {
        id: '10HbaBKmGkI',
        title:
          'SNIK & IVAN GREKO - GAZA',
        description:
          'Official music video for Gaza by SNIK and Ivan Greko.',
        thumbnail:
          'https://img.youtube.com/vi/10HbaBKmGkI/hqdefault.jpg',
        videoUrl:
          'https://www.youtube.com/watch?v=10HbaBKmGkI',
        url:
          'https://www.youtube.com/watch?v=10HbaBKmGkI',
        type: 'video',
        category: 'Music',
        artist: 'SNIK & Ivan Greko',
      },

    ];

    /*
     * Duplicate the collection to demonstrate pagination.
     *
     * REMOVE THIS SECTION once you connect this component
     * to your real video API.
     */

    const originalVideos = [...this.videos];

    for (let i = 1; i <= 5; i++) {

      this.videos.push(
        ...originalVideos.map((video, index) => ({
          ...video,

          /*
           * Unique frontend ID.
           */

          id: `${video.id}-${i}-${index}`,

          /*
           * Keep original YouTube ID separately.
           */

          youtubeId: video.id,

          /*
           * Slightly different display metadata.
           */

          title:
            `${video.title} — ${i + 1}`,

        }))
      );

    }

    /*
     * Initialize pagination.
     */

    this.initializePagination();

    this.isLoading = false;

  }


  /* ==========================================================
     INITIALIZE PAGINATION
     ========================================================== */

  private initializePagination(): void {

    this.totalVideos =
      this.videos.length;

    this.totalPages =
      Math.ceil(
        this.totalVideos /
        this.pageSize
      );

    if (
      this.currentPage >
      this.totalPages &&
      this.totalPages > 0
    ) {

      this.currentPage =
        this.totalPages;

    }

    if (this.totalPages === 0) {

      this.currentPage = 1;

    }

    this.buildPageNumbers();

    this.updatePagedVideos();

  }


  /* ==========================================================
     UPDATE PAGED VIDEOS
     ========================================================== */

  private updatePagedVideos(): void {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    const endIndex =
      startIndex +
      this.pageSize;

    this.pagedVideos =
      this.videos.slice(
        startIndex,
        endIndex
      );

  }


  /* ==========================================================
     BUILD PAGE NUMBERS
     ========================================================== */

  private buildPageNumbers(): void {

    this.pages = [];

    for (
      let page = 1;
      page <= this.totalPages;
      page++
    ) {

      this.pages.push(page);

    }

  }


  /* ==========================================================
     GO TO PAGE
     ========================================================== */

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {

      return;

    }

    this.currentPage = page;

    this.updatePagedVideos();

    this.scrollToTop();

  }


  /* ==========================================================
     NEXT
     ========================================================== */

  goToNextPage(): void {

    if (
      this.currentPage >=
      this.totalPages
    ) {

      return;

    }

    this.currentPage++;

    this.updatePagedVideos();

    this.scrollToTop();

  }


  /* ==========================================================
     PREVIOUS
     ========================================================== */

  goToPreviousPage(): void {

    if (this.currentPage <= 1) {

      return;

    }

    this.currentPage--;

    this.updatePagedVideos();

    this.scrollToTop();

  }


  /* ==========================================================
     PAGE SIZE
     ========================================================== */

  onPageSizeChange(): void {

    this.currentPage = 1;

    this.totalPages =
      Math.ceil(
        this.totalVideos /
        this.pageSize
      );

    this.buildPageNumbers();

    this.updatePagedVideos();

    this.scrollToTop();

  }


  /* ==========================================================
     TRACK BY
     ========================================================== */

  trackByVideo(
    index: number,
    video: any
  ): any {

    return (
      video?.id ??
      video?.Id ??
      video?.youtubeId ??
      index
    );

  }


  /* ==========================================================
     PAGE START
     ========================================================== */

  get pageStart(): number {

    if (this.totalVideos === 0) {

      return 0;

    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;

  }


  /* ==========================================================
     PAGE END
     ========================================================== */

  get pageEnd(): number {

    return Math.min(
      this.currentPage *
      this.pageSize,
      this.totalVideos
    );

  }


  /* ==========================================================
     SCROLL TOP
     ========================================================== */

  private scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  }

}
