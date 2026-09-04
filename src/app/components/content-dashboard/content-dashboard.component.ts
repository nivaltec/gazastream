import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ContentSummary } from 'src/app/models/content-summary';
import { DailyAnalytics } from 'src/app/models/daily-analytics';
import { TopContent } from 'src/app/models/top-content';

@Component({
  selector: 'app-content-dashboard',
  standalone: false,
  templateUrl: './content-dashboard.component.html',
  styleUrl: './content-dashboard.component.css',
})
export class ContentDashboardComponent implements OnInit {
  /* ==============================================================
     VIEW
     ============================================================== */

  @ViewChild('dashboardReport')
  dashboardReport!: ElementRef<HTMLElement>;

  /* ==============================================================
     STATE
     ============================================================== */

  isExporting = false;

  selectedPeriod = 30;

  /* ==============================================================
     KPI VALUES
     ============================================================== */

  totalPlays = 0;
  totalListeners = 0;
  totalWatchTime = 0;
  totalFavourites = 0;

  playsChange = 0;
  listenersChange = 0;
  favouritesChange = 0;

  /* ==============================================================
     AUDIENCE
     ============================================================== */

  returningListeners = 0;
  newListeners = 0;
  averageSessions = 0;
  completionRate = 0;

  /* ==============================================================
     ANALYTICS
     ============================================================== */

  contentSummary: ContentSummary[] = [];
  topContent: TopContent[] = [];
  dailyAnalytics: DailyAnalytics[] = [];

  /* ==============================================================
     CHART
     ============================================================== */

  chartMaxValue = 0;

  /* ==============================================================
     CONSTRUCTOR
     ============================================================== */

  constructor() {}

  /* ==============================================================
     INIT
     ============================================================== */

  ngOnInit(): void {
    this.loadAnalytics();
  }

  /* ==============================================================
     LOAD ANALYTICS
     ============================================================== */

  private loadAnalytics(): void {
    /*
     * Replace this section later with your API call.
     *
     * The dashboard is intentionally kept independent from the
     * backend so you can connect it to your analytics API without
     * changing the HTML.
     */

    this.contentSummary = this.buildContentSummary();

    this.topContent = this.buildTopContent();

    this.dailyAnalytics = this.buildDailyAnalytics(this.selectedPeriod);

    this.calculateTotals();

    this.calculateAudienceMetrics();

    this.calculateChartMaximum();
  }

  /* ==============================================================
     PERIOD CHANGE
     ============================================================== */

  onPeriodChange(): void {
    this.dailyAnalytics = this.buildDailyAnalytics(this.selectedPeriod);

    this.calculateTotals();

    this.calculateAudienceMetrics();

    this.calculateChartMaximum();
  }

  /* ==============================================================
     CONTENT SUMMARY
     ============================================================== */

  private buildContentSummary(): ContentSummary[] {
    return [
      {
        type: 'podcast',
        label: 'Podcasts',
        icon: 'fa-solid fa-podcast',

        plays: 184250,
        uniqueListeners: 62380,
        watchTimeMinutes: 582400,
        favourites: 12480,

        percentage: 28,
      },

      {
        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 296840,
        uniqueListeners: 98420,
        watchTimeMinutes: 741600,
        favourites: 21340,

        percentage: 45,
      },

      {
        type: 'video',
        label: 'Videos',
        icon: 'fa-solid fa-video',

        plays: 128560,
        uniqueListeners: 54120,
        watchTimeMinutes: 316800,
        favourites: 9870,

        percentage: 19,
      },

      {
        type: 'radio',
        label: 'Radio',
        icon: 'fa-solid fa-radio',

        plays: 52340,
        uniqueListeners: 18360,
        watchTimeMinutes: 182400,
        favourites: 4260,

        percentage: 8,
      },
    ];
  }

  /* ==============================================================
     TOP CONTENT
     ============================================================== */

  private buildTopContent(): TopContent[] {
    return [
      {
        id: 'podcast-001',

        title: 'Voices from Gaza — Stories from the Ground',

        creator: 'Gaza Stream Podcast',

        type: 'podcast',
        label: 'Podcast',
        icon: 'fa-solid fa-podcast',

        plays: 84250,
        uniqueListeners: 32840,
        completionRate: 87,

        artwork:
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop',
      },

      {
        id: 'music-001',

        title: 'Palestinian Music Sessions',

        creator: 'Gaza Stream Music',

        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 72340,
        uniqueListeners: 38120,
        completionRate: 91,

        artwork:
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop',
      },

      {
        id: 'video-001',

        title: 'Inside Gaza — Daily Update',

        creator: 'Gaza Stream News',

        type: 'video',
        label: 'Video',
        icon: 'fa-solid fa-video',

        plays: 65420,
        uniqueListeners: 29750,
        completionRate: 78,

        artwork:
          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop',
      },

      {
        id: 'music-002',

        title: 'Voices of Palestine',

        creator: 'Gaza Stream',

        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 58320,
        uniqueListeners: 27380,
        completionRate: 84,

        artwork:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop',
      },

      {
        id: 'radio-001',

        title: 'Gaza Stream Live Radio',

        creator: 'Gaza Stream Radio',

        type: 'radio',
        label: 'Radio',
        icon: 'fa-solid fa-radio',

        plays: 52340,
        uniqueListeners: 18360,
        completionRate: 73,

        artwork:
          'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&auto=format&fit=crop',
      },

      {
        id: 'podcast-002',

        title: 'Palestinian Voices',

        creator: 'Gaza Stream Podcast',

        type: 'podcast',
        label: 'Podcast',
        icon: 'fa-solid fa-podcast',

        plays: 48620,
        uniqueListeners: 19240,
        completionRate: 81,

        artwork:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
      },
    ];
  }

  /* ==============================================================
     DAILY ANALYTICS
     ============================================================== */

  private buildDailyAnalytics(period: number): DailyAnalytics[] {
    const results: DailyAnalytics[] = [];

    const today = new Date();

    const numberOfDays = Math.min(Math.max(period, 7), 365);

    /*
     * For a 365-day report, don't render 365 individual bars.
     * Aggregate the year into approximately 30 points.
     */

    const points =
      numberOfDays > 120 ? 30 : numberOfDays > 60 ? 30 : numberOfDays;

    const step = numberOfDays / points;

    for (let index = 0; index < points; index++) {
      const daysAgo = Math.round((points - 1 - index) * step);

      const date = new Date(today);

      date.setDate(today.getDate() - daysAgo);

      const seasonal = Math.sin(index * 0.72) * 0.15;

      const weekly = Math.sin(index * 1.8) * 0.08;

      const random = ((index * 37) % 17) / 100;

      const playsBase =
        numberOfDays <= 7
          ? 18500
          : numberOfDays <= 30
            ? 21000
            : numberOfDays <= 90
              ? 23500
              : 26000;

      const listenersBase =
        numberOfDays <= 7
          ? 7200
          : numberOfDays <= 30
            ? 8100
            : numberOfDays <= 90
              ? 9200
              : 10400;

      const plays = Math.round(playsBase * (1 + seasonal + weekly + random));

      const listeners = Math.round(
        listenersBase * (1 + seasonal * 0.7 + weekly + random * 0.6),
      );

      results.push({
        date: date.toISOString(),

        plays,

        listeners,
      });
    }

    return results;
  }

  /* ==============================================================
     TOTALS
     ============================================================== */

  private calculateTotals(): void {
    const summary = this.contentSummary;

    const basePlays = summary.reduce((total, item) => total + item.plays, 0);

    const baseListeners = summary.reduce(
      (total, item) => total + item.uniqueListeners,
      0,
    );

    const baseWatchTime = summary.reduce(
      (total, item) => total + item.watchTimeMinutes,
      0,
    );

    const baseFavourites = summary.reduce(
      (total, item) => total + item.favourites,
      0,
    );

    const multiplier = this.getPeriodMultiplier();

    this.totalPlays = Math.round(basePlays * multiplier);

    this.totalListeners = Math.round(baseListeners * multiplier);

    this.totalWatchTime = Math.round(baseWatchTime * multiplier);

    this.totalFavourites = Math.round(baseFavourites * multiplier);

    /*
     * Percentage changes are sample analytics.
     * Replace these values with backend comparisons
     * when your analytics API is connected.
     */

    this.playsChange =
      this.selectedPeriod === 7
        ? 12.8
        : this.selectedPeriod === 30
          ? 18.4
          : this.selectedPeriod === 90
            ? 24.7
            : 31.2;

    this.listenersChange =
      this.selectedPeriod === 7
        ? 8.6
        : this.selectedPeriod === 30
          ? 14.2
          : this.selectedPeriod === 90
            ? 19.8
            : 27.5;

    this.favouritesChange =
      this.selectedPeriod === 7
        ? 6.4
        : this.selectedPeriod === 30
          ? 11.8
          : this.selectedPeriod === 90
            ? 16.9
            : 22.6;
  }

  /* ==============================================================
     PERIOD MULTIPLIER
     ============================================================== */

  private getPeriodMultiplier(): number {
    switch (this.selectedPeriod) {
      case 7:
        return 0.24;

      case 30:
        return 1;

      case 90:
        return 2.85;

      case 365:
        return 11.4;

      default:
        return 1;
    }
  }

  /* ==============================================================
     AUDIENCE METRICS
     ============================================================== */

  private calculateAudienceMetrics(): void {
    const total = this.totalListeners || 1;

    const returning = Math.round(total * 0.64);

    const newAudience = total - returning;

    this.returningListeners = Math.round((returning / total) * 100);

    this.newListeners = Math.round((newAudience / total) * 100);

    this.averageSessions = Number((2.7 + this.selectedPeriod / 100).toFixed(1));

    const weightedCompletion = this.topContent.length
      ? this.topContent.reduce(
          (total, item) => total + item.completionRate,
          0,
        ) / this.topContent.length
      : 0;

    this.completionRate = Math.round(weightedCompletion);
  }

  /* ==============================================================
     CHART MAXIMUM
     ============================================================== */

  private calculateChartMaximum(): void {
    const values = this.dailyAnalytics.flatMap((item) => [
      item.plays,
      item.listeners,
    ]);

    this.chartMaxValue = values.length ? Math.max(...values) : 1;
  }

  /* ==============================================================
     CHART HEIGHT
     ============================================================== */

  getChartHeight(value: number): number {
    if (!Number.isFinite(value) || this.chartMaxValue <= 0) {
      return 0;
    }

    const percentage = (value / this.chartMaxValue) * 100;

    return Math.min(Math.max(percentage, 2), 100);
  }

  /* ==============================================================
     CHART DATE
     ============================================================== */

  formatChartDate(date: string): string {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return '';
    }

    if (this.selectedPeriod > 120) {
      return value.toLocaleDateString('en-ZA', {
        month: 'short',
      });
    }

    return value.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
    });
  }

  /* ==============================================================
     NUMBER FORMATTING
     ============================================================== */

  formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return '0';
    }

    return new Intl.NumberFormat('en-ZA').format(value);
  }

  /* ==============================================================
     COMPACT NUMBER
     ============================================================== */

  formatCompactNumber(value: number): string {
    if (!Number.isFinite(value)) {
      return '0';
    }

    return new Intl.NumberFormat('en-ZA', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  /* ==============================================================
     PERCENTAGE
     ============================================================== */

  formatPercentage(value: number): string {
    const sign = value >= 0 ? '+' : '';

    return sign + value.toFixed(1) + '%';
  }

  /* ==============================================================
     WATCH TIME
     ============================================================== */

  formatWatchTime(minutes: number): string {
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return '0m';
    }

    const hours = Math.floor(minutes / 60);

    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
      return `${this.formatNumber(hours)}h`;
    }

    return `${this.formatNumber(hours)}h ` + `${remainingMinutes}m`;
  }

  /* ==============================================================
     TRACK BY
     ============================================================== */

  trackByContent(index: number, content: TopContent): string | number {
    return content.id || index;
  }

  /* ==============================================================
     VIEW CONTENT REPORT
     ============================================================== */

  viewContentReport(content: TopContent): void {
    /*
     * This can later navigate to:
     *
     * /dashboard/content/:id
     *
     * or open a dedicated report modal.
     */

    console.info('Gaza Stream content report:', content);

    /*
     * For now, create a simple browser notification.
     * Replace this with your Angular dialog/router when
     * the detailed report page is available.
     */

    if (typeof window !== 'undefined') {
      window.alert(
        `${content.title}\n\n` +
          `Plays: ${this.formatNumber(content.plays)}\n` +
          `Listeners: ${this.formatNumber(content.uniqueListeners)}\n` +
          `Completion: ${content.completionRate}%`,
      );
    }
  }

  /* ==============================================================
     EXPORT REPORT
     ============================================================== */

  exportReport(): void {
    this.exportToPdf();
  }

  /* ==============================================================
     EXPORT PDF
     ============================================================== */

  async exportToPdf(): Promise<void> {
    if (this.isExporting || !this.dashboardReport) {
      return;
    }

    this.isExporting = true;

    try {
      /*
       * Give Angular time to update the button
       * from "Export PDF" to "Generating PDF..."
       */

      await this.wait(150);

      const element = this.dashboardReport.nativeElement;

      /*
       * Make sure images have finished loading before
       * html2canvas captures the dashboard.
       */

      await this.waitForImages(element);

      const canvas = await html2canvas(element, {
        scale: 2,

        useCORS: true,

        allowTaint: false,

        backgroundColor: '#08080d',

        logging: false,

        imageTimeout: 15000,

        windowWidth: element.scrollWidth,

        windowHeight: element.scrollHeight,
      });

      const imageData = canvas.toDataURL('image/png', 1);

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();

      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 8;

      const contentWidth = pageWidth - margin * 2;

      const imageHeight = (canvas.height * contentWidth) / canvas.width;

      /*
       * Add a professional report header.
       */

      this.addPdfHeader(pdf);

      const headerHeight = 28;

      const footerHeight = 10;

      const availableHeight = pageHeight - headerHeight - footerHeight - margin;

      /*
       * If the dashboard fits on one page, render it directly.
       */

      if (imageHeight <= availableHeight) {
        pdf.addImage(
          imageData,
          'PNG',
          margin,
          headerHeight,
          contentWidth,
          imageHeight,
        );

        this.addPdfFooter(pdf, 1, 1);
      } else {
        /*
         * Large dashboard:
         *
         * Split the canvas across multiple A4 pages.
         */

        const sourcePageHeight = Math.floor(
          (availableHeight * canvas.width) / contentWidth,
        );

        const totalPages = Math.ceil(canvas.height / sourcePageHeight);

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const sourceY = page * sourcePageHeight;

          const currentSourceHeight = Math.min(
            sourcePageHeight,
            canvas.height - sourceY,
          );

          const pageCanvas = document.createElement('canvas');

          pageCanvas.width = canvas.width;

          pageCanvas.height = currentSourceHeight;

          const context = pageCanvas.getContext('2d');

          if (!context) {
            continue;
          }

          context.fillStyle = '#08080d';

          context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

          context.drawImage(
            canvas,

            0,
            sourceY,
            canvas.width,
            currentSourceHeight,

            0,
            0,
            pageCanvas.width,
            currentSourceHeight,
          );

          const pageImage = pageCanvas.toDataURL('image/png', 1);

          const renderedHeight =
            (currentSourceHeight * contentWidth) / canvas.width;

          pdf.addImage(
            pageImage,
            'PNG',
            margin,
            headerHeight,
            contentWidth,
            renderedHeight,
          );

          this.addPdfFooter(pdf, page + 1, totalPages);
        }
      }

      pdf.save(this.createFilename());
    } catch (error) {
      console.error('Gaza Stream PDF export failed:', error);

      if (typeof window !== 'undefined') {
        window.alert(
          'Unable to generate the PDF report. ' + 'Please try again.',
        );
      }
    } finally {
      this.isExporting = false;
    }
  }

  /* ==============================================================
     PDF HEADER
     ============================================================== */

  private addPdfHeader(pdf: jsPDF): void {
    const pageWidth = pdf.internal.pageSize.getWidth();

    /*
     * Brand
     */

    pdf.setFont('helvetica', 'bold');

    pdf.setFontSize(17);

    pdf.setTextColor(255, 255, 255);

    pdf.text('GAZA STREAM', 8, 10);

    /*
     * Report title
     */

    pdf.setFont('helvetica', 'bold');

    pdf.setFontSize(10);

    pdf.setTextColor(8, 207, 255);

    pdf.text('CONTENT ANALYTICS REPORT', 8, 16);

    /*
     * Period
     */

    pdf.setFont('helvetica', 'normal');

    pdf.setFontSize(8);

    pdf.setTextColor(170, 170, 180);

    const periodLabel = this.getPeriodLabel();

    pdf.text(periodLabel, 8, 22);

    /*
     * Generated date
     */

    const generated = new Date().toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    pdf.text(`Generated ${generated}`, pageWidth - 8, 22, {
      align: 'right',
    });

    /*
     * Divider
     */

    pdf.setDrawColor(55, 55, 65);

    pdf.setLineWidth(0.25);

    pdf.line(8, 25, pageWidth - 8, 25);
  }

  /* ==============================================================
     PDF FOOTER
     ============================================================== */

  private addPdfFooter(
    pdf: jsPDF,
    pageNumber: number,
    totalPages: number,
  ): void {
    const pageWidth = pdf.internal.pageSize.getWidth();

    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setDrawColor(45, 45, 55);

    pdf.setLineWidth(0.2);

    pdf.line(8, pageHeight - 9, pageWidth - 8, pageHeight - 9);

    pdf.setFont('helvetica', 'normal');

    pdf.setFontSize(7);

    pdf.setTextColor(125, 125, 135);

    pdf.text('Gaza Stream — Content Analytics', 8, pageHeight - 4);

    pdf.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - 8,
      pageHeight - 4,
      {
        align: 'right',
      },
    );
  }

  /* ==============================================================
     PERIOD LABEL
     ============================================================== */

  private getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 7:
        return 'Reporting period: Last 7 days';

      case 30:
        return 'Reporting period: Last 30 days';

      case 90:
        return 'Reporting period: Last 90 days';

      case 365:
        return 'Reporting period: Last 12 months';

      default:
        return 'Reporting period';
    }
  }

  /* ==============================================================
     WAIT FOR IMAGES
     ============================================================== */

  private async waitForImages(element: HTMLElement): Promise<void> {
    const images = Array.from(element.querySelectorAll('img'));

    if (!images.length) {
      return;
    }

    await Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();

              return;
            }

            const done = () => {
              image.removeEventListener('load', done);

              image.removeEventListener('error', done);

              resolve();
            };

            image.addEventListener('load', done);

            image.addEventListener('error', done);

            /*
             * Don't let one broken remote image
             * block the complete PDF export.
             */

            setTimeout(done, 5000);
          }),
      ),
    );
  }

  /* ==============================================================
     DELAY
     ============================================================== */

  private wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /* ==============================================================
     FILENAME
     ============================================================== */

  private createFilename(): string {
    const date = new Date().toISOString().slice(0, 10);

    return `gaza-stream-content-analytics-` + `${date}.pdf`;
  }
}
