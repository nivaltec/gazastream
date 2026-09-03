export interface Rss2JsonResponse {
  status: string;
  feed: {
    title: string;
    link: string;
    description: string;
  };
  items: {
    title: string;
    pubDate: string;
    link: string;
    guid?: string;
    author?: string;
    thumbnail?: string;
    description?: string;
    content?: string;
    enclosure?: {
      link?: string;
      type?: string;
    };
  }[];
}
