/*import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { NewsCategory } from '../enums/news-category-type';


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/news';



  /**
   * Get all news.
   *
  getNews(): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(this.apiUrl);
  }

  /**
   * Get news for a specific category.
   *
  getNewsByCategory(
    category: NewsCategory
  ): Observable<NewsResponse> {

    const params = new HttpParams()
      .set('category', category);

    return this.http.get<NewsResponse>(
      this.apiUrl,
      { params }
    );
  }

  /**
   * Get all five categories at once.

  getNewsByCategories(): Observable<
    Record<NewsCategory, NewsArticle[]>
  > {

    return forkJoin({
      politics: this.getNewsByCategory('politics'),
      business: this.getNewsByCategory('business'),
      finance: this.getNewsByCategory('finance'),
      sports: this.getNewsByCategory('sports'),
      entertainment: this.getNewsByCategory('entertainment')
    }).pipe(

      map(result => ({
        politics: result.politics.articles,
        business: result.business.articles,
        finance: result.finance.articles,
        sports: result.sports.articles,
        entertainment: result.entertainment.articles
      })),

      shareReplay(1)
    );
  }

  /**
   * Search news.

  searchNews(
    query: string
  ): Observable<NewsResponse> {

    const params = new HttpParams()
      .set('q', query);

    return this.http.get<NewsResponse>(
      `${this.apiUrl}/search`,
      { params }
    );
  }
}
*/
