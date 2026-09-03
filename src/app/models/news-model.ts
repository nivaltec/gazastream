import { NewsCategory } from "../enums/news-category-type";


export interface NewsArticle {
  guid: any;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
  source: string;
  category: NewsCategory;
}

export interface NewsFeed {
  title: string;
  url: string;
  category: NewsCategory;
}
