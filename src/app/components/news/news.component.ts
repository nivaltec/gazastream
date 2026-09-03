import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  image: string;
  category: string;
  readTime: number;
}

@Component({
  selector: 'app-news',
  standalone: false,
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  currentDate = new Date().toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  selectedCategory = 'all';

  categories = [
    {
      name: 'all',
      label: 'All News',
      icon: 'bi-grid-fill'
    },
    {
      name: 'entertainment',
      label: 'Entertainment',
      icon: 'bi-stars'
    },
    {
      name: 'sport',
      label: 'Sport',
      icon: 'bi-trophy-fill'
    },
    {
      name: 'finance',
      label: 'Finance',
      icon: 'bi-graph-up-arrow'
    },
    {
      name: 'business',
      label: 'Business',
      icon: 'bi-briefcase-fill'
    },
    {
      name: 'politics',
      label: 'Politics',
      icon: 'bi-bank2'
    }
  ];

  // ==========================================================
  // TOP STORIES
  // ==========================================================

  topStories: NewsArticle[] = [
    {
      id: 1,
      title: 'Latest developments continue to shape the global news cycle',
      description:
        'Follow the latest developments, statements and reactions as major international stories continue to unfold.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/',
      image:
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      category: 'politics',
      readTime: 5
    },
    {
      id: 2,
      title: 'World leaders respond to major international developments',
      description:
        'Governments and international organisations continue to assess the latest developments.',
      source: 'BBC News',
      publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      url: 'https://www.bbc.com/news',
      image:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=80',
      category: 'politics',
      readTime: 4
    },
    {
      id: 3,
      title: 'Markets react as investors assess the latest economic signals',
      description:
        'Financial markets remain focused on economic data, interest rates and global developments.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/markets/',
      image:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
      category: 'finance',
      readTime: 4
    },
    {
      id: 4,
      title: 'Businesses prepare for changing global economic conditions',
      description:
        'Companies continue to adapt their strategies as global economic conditions evolve.',
      source: 'CNBC',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.cnbc.com/world/',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
      category: 'business',
      readTime: 5
    }
  ];

  // ==========================================================
  // ENTERTAINMENT
  // ==========================================================

  entertainmentNews: NewsArticle[] = [
    {
      id: 101,
      title: 'Film and television industry prepares for another major release season',
      description:
        'Studios, actors and audiences are preparing for a busy period of new film and television releases.',
      source: 'Variety',
      publishedAt: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
      url: 'https://variety.com/',
      image:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
      category: 'entertainment',
      readTime: 4
    },
    {
      id: 102,
      title: 'Music stars announce new projects and upcoming performances',
      description:
        'Artists around the world are announcing new music, tours and performances for fans.',
      source: 'Billboard',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.billboard.com/',
      image:
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=80',
      category: 'entertainment',
      readTime: 3
    },
    {
      id: 103,
      title: 'Global entertainment industry continues to evolve',
      description:
        'Streaming, cinema and digital platforms continue to reshape the entertainment landscape.',
      source: 'The Hollywood Reporter',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.hollywoodreporter.com/',
      image:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80',
      category: 'entertainment',
      readTime: 5
    }
  ];

  // ==========================================================
  // SPORT
  // ==========================================================

  sportNews: NewsArticle[] = [
    {
      id: 201,
      title: 'Major sporting events draw attention from fans around the world',
      description:
        'Fans are following the latest results, performances and developments across international sport.',
      source: 'ESPN',
      publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      url: 'https://www.espn.com/',
      image:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
      category: 'sport',
      readTime: 4
    },
    {
      id: 202,
      title: 'Teams prepare for another important round of fixtures',
      description:
        'Clubs and athletes continue preparations as the sporting calendar enters another busy period.',
      source: 'Sky Sports',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.skysports.com/',
      image:
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
      category: 'sport',
      readTime: 3
    },
    {
      id: 203,
      title: 'International stars make headlines with standout performances',
      description:
        'Top athletes continue to make headlines with impressive performances across major competitions.',
      source: 'BBC Sport',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.bbc.com/sport',
      image:
        'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?auto=format&fit=crop&w=1000&q=80',
      category: 'sport',
      readTime: 4
    }
  ];

  // ==========================================================
  // FINANCE
  // ==========================================================

  financeNews: NewsArticle[] = [
    {
      id: 301,
      title: 'Global markets remain focused on economic data and interest rates',
      description:
        'Investors continue to monitor inflation, interest rates and economic growth.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/markets/',
      image:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
      category: 'finance',
      readTime: 4
    },
    {
      id: 302,
      title: 'Investors assess changing conditions across major economies',
      description:
        'Financial markets are responding to new economic indicators and corporate developments.',
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.ft.com/',
      image:
        'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1000&q=80',
      category: 'finance',
      readTime: 5
    },
    {
      id: 303,
      title: 'Currency and equity markets continue to navigate global uncertainty',
      description:
        'Traders are watching economic indicators and geopolitical developments closely.',
      source: 'CNBC',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.cnbc.com/markets/',
      image:
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80',
      category: 'finance',
      readTime: 4
    }
  ];

  // ==========================================================
  // BUSINESS
  // ==========================================================

  businessNews: NewsArticle[] = [
    {
      id: 401,
      title: 'Companies continue investing in technology and digital transformation',
      description:
        'Businesses are increasing their focus on technology, productivity and digital services.',
      source: 'CNBC',
      publishedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
      url: 'https://www.cnbc.com/business/',
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
      category: 'business',
      readTime: 4
    },
    {
      id: 402,
      title: 'Global companies adapt strategies to changing market conditions',
      description:
        'Businesses across several sectors are adapting to shifts in consumer demand and global markets.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/business/',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80',
      category: 'business',
      readTime: 5
    },
    {
      id: 403,
      title: 'Entrepreneurs continue to explore opportunities in emerging industries',
      description:
        'New businesses and established companies are looking for opportunities in fast-growing sectors.',
      source: 'Forbes',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.forbes.com/business/',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
      category: 'business',
      readTime: 4
    }
  ];

  // ==========================================================
  // POLITICS
  // ==========================================================

  politicsNews: NewsArticle[] = [
    {
      id: 501,
      title: 'International leaders continue discussions on major global issues',
      description:
        'Governments and international organisations remain engaged on several major global issues.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/world/',
      image:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=80',
      category: 'politics',
      readTime: 5
    },
    {
      id: 502,
      title: 'Governments respond to growing international pressure',
      description:
        'Political leaders are responding to developments at home and abroad.',
      source: 'BBC News',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.bbc.com/news/world',
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1000&q=80',
      category: 'politics',
      readTime: 4
    },
    {
      id: 503,
      title: 'Diplomatic efforts continue as countries seek common ground',
      description:
        'Diplomatic discussions continue as governments work towards agreements on international issues.',
      source: 'Al Jazeera',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.aljazeera.com/',
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1000&q=80',
      category: 'politics',
      readTime: 5
    }
  ];

  // ==========================================================
  // GAZA / MIDDLE EAST
  // ==========================================================

  gazaNews: NewsArticle[] = [
    {
      id: 601,
      title: 'Latest developments in Gaza and the wider Middle East',
      description:
        'International organisations and news outlets continue to report on developments in Gaza and across the region.',
      source: 'Al Jazeera',
      publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      url: 'https://www.aljazeera.com/where/gaza/',
      image:
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      category: 'politics',
      readTime: 6
    },
    {
      id: 602,
      title: 'International community continues monitoring humanitarian situation',
      description:
        'Aid agencies and international organisations continue monitoring humanitarian developments in the region.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.reuters.com/world/middle-east/',
      image:
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80',
      category: 'politics',
      readTime: 5
    },
    {
      id: 603,
      title: 'Regional leaders continue diplomatic discussions',
      description:
        'Regional and international leaders continue diplomatic efforts around the conflict and wider regional stability.',
      source: 'BBC News',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.bbc.com/news/world/middle_east',
      image:
        'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
      category: 'politics',
      readTime: 5
    }
  ];

  // ==========================================================
  // ALL NEWS
  // ==========================================================

  get allNews(): NewsArticle[] {
    return [
      ...this.topStories,
      ...this.entertainmentNews,
      ...this.sportNews,
      ...this.financeNews,
      ...this.businessNews,
      ...this.politicsNews,
      ...this.gazaNews
    ];
  }

  // ==========================================================
  // VISIBLE STORIES
  // ==========================================================

  get visibleStories(): NewsArticle[] {
    if (this.selectedCategory === 'all') {
      return this.topStories;
    }

    return this.allNews.filter(
      article => article.category === this.selectedCategory
    );
  }

  // ==========================================================
  // CATEGORY SELECTION
  // ==========================================================

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  // ==========================================================
  // TIME AGO
  // ==========================================================

  getTimeAgo(date: string): string {
    const publishedDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - publishedDate.getTime();

    if (difference < 0) {
      return 'Just now';
    }

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    return publishedDate.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByArticle(index: number, article: NewsArticle): number {
    return article.id ?? index;
  }
}
