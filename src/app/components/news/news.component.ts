import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  source: string;
  author?: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  breaking?: boolean;
  tags?: string[];
  url?: string;
}

@Component({
  selector: 'app-news',
  standalone:false,
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  // ============================================================
  // STATE
  // ============================================================

  articles: NewsArticle[] = [];

  filteredArticles: NewsArticle[] = [];

  selectedArticle: NewsArticle | null = null;

  searchTerm = '';

  selectedCategory = 'All';

  isLoading = false;

  errorMessage = '';

  lastUpdated = '';

  // ============================================================
  // CATEGORIES
  // ============================================================

  categories: string[] = [
    'All',
    'Breaking',
    'Politics',
    'World',
    'Humanitarian',
    'Analysis'
  ];

  // ============================================================
  // DEFAULT INTERNET IMAGE
  // ============================================================

  private readonly defaultImage =
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85';

  // ============================================================
  // HARD-CODED NEWS
  // ============================================================

  private readonly hardCodedArticles: NewsArticle[] = [

    // ==========================================================
    // BREAKING
    // ==========================================================

    {
      id: 1,
      category: 'Breaking',
      title:
        'Gaza seed bank helps farmers cultivate the little land they have left',
      description:
        'Farmers in Gaza are rebuilding a local seed bank as they work to preserve crops and restore agricultural production.',
      content:
        `Farmers in Gaza are working to preserve native crops by rebuilding a local seed bank.

The project aims to protect traditional varieties that can be replanted and may be better suited to local growing conditions.

Farmers continue to face major challenges because agricultural land and infrastructure have been heavily affected by the conflict.

The seed-bank initiative is part of wider efforts to preserve agricultural knowledge and maintain local food-producing capacity.

The complete report is available from the original publisher.`,
      image:
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      author: 'Reuters',
      publishedAt: 'September 3, 2026',
      readTime: 3,
      featured: true,
      breaking: true,
      tags: [
        'Gaza',
        'Agriculture',
        'Food',
        'Humanitarian'
      ],
      url:
        'https://www.reuters.com/world/middle-east/gaza-seed-bank-helps-farmers-cultivate-little-land-they-have-left-2026-09-03/'
    },

    {
      id: 2,
      category: 'Breaking',
      title:
        'Israeli special forces capture Hamas official in Gaza City raid',
      description:
        'Israeli forces reported capturing a Hamas official during an operation in Gaza City amid continued military activity.',
      content:
        `Israeli forces reported that special forces captured a Hamas official during a raid in Gaza City.

The operation came amid continuing military activity and renewed concerns about the durability of ceasefire arrangements.

Residents continue to face uncertainty as military operations and political negotiations develop in parallel.

The original report contains the latest operational details and statements from the parties involved.`,
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      author: 'Reuters',
      publishedAt: 'September 1, 2026',
      readTime: 3,
      breaking: true,
      tags: [
        'Gaza City',
        'Israel',
        'Hamas',
        'Military'
      ],
      url:
        'https://www.reuters.com/world/middle-east/israeli-fire-kills-four-people-including-three-children-gaza-medics-say-2026-09-01/'
    },

    {
      id: 3,
      category: 'Breaking',
      title:
        'New restrictions reported across parts of Gaza',
      description:
        'Newly reported military restrictions are raising concerns about civilian movement and access to agricultural areas.',
      content:
        `New military restrictions have reportedly affected parts of Gaza.

The changes are being closely watched because restrictions can affect civilian movement, agricultural access and humanitarian operations.

Residents and humanitarian organisations continue to monitor changes across the territory.

The situation remains fluid and further developments could affect civilian conditions.`,
      image:
        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      publishedAt: 'September 2026',
      readTime: 3,
      breaking: true,
      tags: [
        'Gaza',
        'Security',
        'Movement',
        'Conflict'
      ],
      url:
        'https://www.reuters.com/world/'
    },

    {
      id: 4,
      category: 'Breaking',
      title:
        'Ceasefire tensions remain high as Gaza violence continues',
      description:
        'Despite ceasefire efforts, reports of continued violence are keeping pressure on negotiators and humanitarian agencies.',
      content:
        `The situation in Gaza remains fragile as reports of continued violence add pressure to diplomatic efforts.

A ceasefire can reduce immediate fighting, but implementation requires continued negotiations, monitoring and agreement between the parties.

Humanitarian organisations remain focused on delivering food, medical supplies, water and shelter assistance.

The situation can change quickly, making continued monitoring essential.`,
      image:
        'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 3,
      breaking: true,
      tags: [
        'Ceasefire',
        'Gaza',
        'Diplomacy'
      ],
      url:
        'https://www.reuters.com/world/israel-hamas/'
    },

    // ==========================================================
    // POLITICS
    // ==========================================================

    {
      id: 5,
      category: 'Politics',
      title:
        'Gaza remains central to Israel’s political debate',
      description:
        'The future of Gaza continues to shape political arguments over security, governance and the direction of the conflict.',
      content:
        `The future of Gaza remains one of the most important political questions facing Israel.

Political debates include security arrangements, Palestinian governance, reconstruction and the role of international partners.

Different political groups continue to disagree over the balance between military security and diplomatic solutions.

The political debate is also closely connected to negotiations over Gaza's long-term future.`,
      image:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Israel',
        'Politics',
        'Gaza',
        'Government'
      ],
      url:
        'https://www.reuters.com/world/israel-hamas/'
    },

    {
      id: 6,
      category: 'Politics',
      title:
        'US lawmakers debate future military cooperation with Israel',
      description:
        'Debate in Washington over future US-Israel defence cooperation continues to be influenced by the Gaza conflict.',
      content:
        `The future of US-Israel defence cooperation remains part of a wider political debate in Washington.

Lawmakers have raised questions about military assistance, defence technology and the conditions surrounding continued cooperation.

The debate reflects broader disagreements over US policy toward Israel and Gaza.

The issue is likely to remain politically significant as future policy decisions are considered.`,
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'United States',
        'Israel',
        'Congress',
        'Politics'
      ],
      url:
        'https://www.reuters.com/world/us/'
    },

    {
      id: 7,
      category: 'Politics',
      title:
        'Regional mediators push for progress on Gaza arrangements',
      description:
        'Egypt, Qatar and other regional actors continue to play an important role in diplomatic efforts surrounding Gaza.',
      content:
        `Regional mediators remain central to attempts to maintain communication between the parties.

Egypt and Qatar have previously played important roles in ceasefire negotiations and humanitarian arrangements.

The diplomatic process involves questions about security, humanitarian access, governance and the future political status of Gaza.

Progress remains dependent on agreement over several difficult issues.`,
      image:
        'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 3,
      tags: [
        'Egypt',
        'Qatar',
        'Diplomacy',
        'Gaza'
      ],
      url:
        'https://www.reuters.com/world/middle-east/'
    },

    {
      id: 8,
      category: 'Politics',
      title:
        'International pressure grows over Gaza’s long-term governance',
      description:
        'Governments and international organisations continue debating who should administer Gaza and how reconstruction could be managed.',
      content:
        `Long-term governance is one of the most difficult questions surrounding Gaza's future.

Potential arrangements have been discussed involving Palestinian institutions, international partners and regional governments.

Any governance model would also need to address security, reconstruction and the delivery of essential services.

The debate remains closely connected to wider negotiations over a lasting political settlement.`,
      image:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Governance',
        'Politics',
        'Reconstruction'
      ],
      url:
        'https://www.un.org/en/'
    },

    // ==========================================================
    // WORLD
    // ==========================================================

    {
      id: 9,
      category: 'World',
      title:
        'Gaza conflict continues to shape wider Middle East diplomacy',
      description:
        'Developments in Gaza continue to influence relations between Israel, Arab states, the United States and international powers.',
      content:
        `The Gaza conflict continues to affect diplomacy across the Middle East.

Regional governments are balancing security concerns, humanitarian issues and domestic political pressure.

International governments are also attempting to influence negotiations and prevent wider regional escalation.

The Gaza situation remains an important part of the wider Middle Eastern diplomatic landscape.`,
      image:
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Middle East',
        'Diplomacy',
        'Gaza'
      ],
      url:
        'https://www.reuters.com/world/middle-east/'
    },

    {
      id: 10,
      category: 'World',
      title:
        'International governments monitor Gaza developments closely',
      description:
        'Governments around the world continue to monitor military, political and humanitarian developments in Gaza.',
      content:
        `Gaza remains a major focus of international diplomacy.

Governments across Europe, North America, the Middle East and other regions continue issuing statements and pursuing diplomatic initiatives.

The international response includes discussions about humanitarian assistance, civilian protection and political negotiations.

Future diplomatic developments will depend heavily on conditions on the ground.`,
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 3,
      tags: [
        'International',
        'World',
        'Diplomacy'
      ],
      url:
        'https://www.un.org/'
    },

    {
      id: 11,
      category: 'World',
      title:
        'Middle East tensions keep international markets and governments alert',
      description:
        'Continued regional instability is being closely watched by governments and businesses around the world.',
      content:
        `Instability in the Middle East can have effects well beyond the immediate conflict zone.

Governments monitor potential consequences for trade routes, energy markets, regional security and international relations.

The Gaza conflict is one element of a broader regional security environment.

International governments continue to call for restraint and diplomatic engagement.`,
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Middle East',
        'Global',
        'Security'
      ],
      url:
        'https://www.reuters.com/world/'
    },

    {
      id: 12,
      category: 'World',
      title:
        'UN continues monitoring humanitarian and political developments',
      description:
        'The United Nations remains involved in humanitarian coordination and diplomatic discussions surrounding Gaza.',
      content:
        `The United Nations continues monitoring developments affecting civilians in Gaza.

UN agencies are involved in humanitarian coordination, food assistance, healthcare and other essential services.

The organisation also remains part of wider international discussions about the future of Gaza.

Humanitarian access remains a major consideration for international agencies.`,
      image:
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=85',
      source: 'United Nations',
      publishedAt: 'September 2026',
      readTime: 3,
      tags: [
        'United Nations',
        'UN',
        'Gaza',
        'World'
      ],
      url:
        'https://www.un.org/'
    },

    // ==========================================================
    // HUMANITARIAN
    // ==========================================================

    {
      id: 13,
      category: 'Humanitarian',
      title:
        'Gaza farmers work to preserve native crops',
      description:
        'Agricultural workers are trying to protect traditional seeds and continue growing food despite damaged farmland.',
      content:
        `Agriculture has long played an important role in Gaza's food system and local economy.

Farmers are attempting to preserve native seed varieties while working with increasingly limited access to agricultural land.

Seed preservation can help communities maintain crop diversity and reduce dependence on imported varieties.

The effort is one example of how local communities are attempting to rebuild essential systems.`,
      image:
        'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=85',
      source: 'Reuters',
      publishedAt: 'September 3, 2026',
      readTime: 3,
      tags: [
        'Agriculture',
        'Food',
        'Gaza',
        'Farmers'
      ],
      url:
        'https://www.reuters.com/world/middle-east/gaza-seed-bank-helps-farmers-cultivate-little-land-they-have-left-2026-09-03/'
    },

    {
      id: 14,
      category: 'Humanitarian',
      title:
        'Humanitarian organisations focus on food and medical assistance',
      description:
        'Aid agencies continue working to provide essential supplies and services to civilians affected by the conflict.',
      content:
        `Humanitarian organisations continue to focus on essential services across Gaza.

Food assistance, clean water, medical treatment and shelter remain major priorities.

Aid delivery depends on access, security and the availability of supplies.

International agencies continue calling for reliable humanitarian access so assistance can reach people who need it.`,
      image:
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Humanitarian',
        'Aid',
        'Food',
        'Healthcare'
      ],
      url:
        'https://www.un.org/en/'
    },

    {
      id: 15,
      category: 'Humanitarian',
      title:
        'Health services remain a major concern for Gaza residents',
      description:
        'Healthcare providers continue facing significant pressure while treating patients and maintaining essential services.',
      content:
        `Healthcare remains one of the most important humanitarian concerns in Gaza.

Medical facilities have faced significant pressure during the conflict, while healthcare workers have continued providing treatment under difficult circumstances.

Supplies, medicines, electricity and access to medical facilities are important factors affecting healthcare delivery.

International organisations continue monitoring the health situation.`,
      image:
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Healthcare',
        'Hospitals',
        'Gaza',
        'Medical'
      ],
      url:
        'https://www.who.int/'
    },

    {
      id: 16,
      category: 'Humanitarian',
      title:
        'Displaced families continue facing difficult living conditions',
      description:
        'Families displaced by the conflict continue dealing with shelter, food, water and other basic needs.',
      content:
        `Large numbers of displaced families continue to face difficult living conditions.

Access to suitable shelter, clean water, food and healthcare remains essential for displaced communities.

Humanitarian organisations are working to support families while conditions remain unstable.

Long-term recovery will require rebuilding homes, infrastructure and essential public services.`,
      image:
        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Desk',
      publishedAt: 'September 2026',
      readTime: 4,
      tags: [
        'Displacement',
        'Shelter',
        'Families',
        'Humanitarian'
      ],
      url:
        'https://www.unhcr.org/'
    },

    // ==========================================================
    // ANALYSIS
    // ==========================================================

    {
      id: 17,
      category: 'Analysis',
      title:
        'What Gaza’s agricultural recovery could mean for food security',
      description:
        'Rebuilding agricultural systems could play an important role in Gaza’s longer-term recovery and food resilience.',
      content:
        `Agriculture is more than an economic activity in Gaza. It can also contribute to local food security.

The destruction of farmland, infrastructure and agricultural equipment has created major obstacles for farmers.

Projects such as seed preservation could help protect local agricultural knowledge and crop diversity.

Recovery will require safe access to farmland, water, equipment and markets.`,
      image:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Analysis',
      publishedAt: 'September 2026',
      readTime: 5,
      tags: [
        'Analysis',
        'Agriculture',
        'Food Security',
        'Recovery'
      ],
      url:
        'https://www.reuters.com/world/middle-east/'
    },

    {
      id: 18,
      category: 'Analysis',
      title:
        'Why Gaza’s future depends on more than a ceasefire',
      description:
        'A lasting reduction in violence would still leave difficult questions around governance, reconstruction and humanitarian recovery.',
      content:
        `A ceasefire can reduce immediate violence, but it does not automatically resolve the underlying political and humanitarian challenges.

Gaza faces questions about governance, reconstruction, security and the restoration of essential infrastructure.

A sustainable recovery would require significant resources and long-term political cooperation.

The future of Gaza will depend on decisions made well beyond the battlefield.`,
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Analysis',
      publishedAt: 'September 2026',
      readTime: 5,
      tags: [
        'Analysis',
        'Ceasefire',
        'Reconstruction',
        'Politics'
      ],
      url:
        'https://www.reuters.com/world/israel-hamas/'
    },

    {
      id: 19,
      category: 'Analysis',
      title:
        'The difficult political question of governing post-war Gaza',
      description:
        'Any future governance model for Gaza would have to address security, legitimacy, reconstruction and public services.',
      content:
        `Governance is likely to be one of the most difficult issues in any long-term Gaza settlement.

A future administration would need to provide public services while gaining sufficient political legitimacy among Palestinians and international partners.

Security arrangements would also be central to any governance model.

Reconstruction adds another layer of complexity because Gaza's infrastructure has suffered extensive damage.

These issues mean that political agreements will likely require cooperation among Palestinian, Israeli, regional and international actors.`,
      image:
        'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Analysis',
      publishedAt: 'September 2026',
      readTime: 6,
      tags: [
        'Analysis',
        'Governance',
        'Politics',
        'Reconstruction'
      ],
      url:
        'https://www.un.org/'
    },

    {
      id: 20,
      category: 'Analysis',
      title:
        'Rebuilding Gaza will require infrastructure, security and international support',
      description:
        'Long-term reconstruction will involve rebuilding homes, hospitals, schools, roads, water systems and other essential infrastructure.',
      content:
        `Rebuilding Gaza will be a major long-term challenge.

Infrastructure including homes, hospitals, schools, roads, water systems and electricity networks will require substantial reconstruction.

Physical reconstruction alone will not be enough. Sustainable recovery also requires functioning institutions, economic activity and reliable access to essential services.

International funding and political cooperation will therefore play an important role in any future reconstruction effort.`,
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
      source: 'Gaza Stream Analysis',
      publishedAt: 'September 2026',
      readTime: 5,
      tags: [
        'Analysis',
        'Reconstruction',
        'Infrastructure',
        'Gaza'
      ],
      url:
        'https://www.un.org/'
    }
  ];

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.enableBodyScroll();
  }

  // ============================================================
  // LOAD NEWS
  // ============================================================

  loadNews(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.articles = this.hardCodedArticles.map(article => ({
      ...article
    }));

    this.lastUpdated = this.getCurrentTime();

    this.applyFilters();

    this.isLoading = false;
  }

  // ============================================================
  // FILTER
  // ============================================================

  applyFilters(): void {

    const search =
      (this.searchTerm || '')
        .trim()
        .toLowerCase();

    this.filteredArticles =
      this.articles.filter(article => {

        const matchesCategory =
          this.selectedCategory === 'All' ||
          article.category === this.selectedCategory;

        if (!matchesCategory) {
          return false;
        }

        if (!search) {
          return true;
        }

        const searchableText = [
          article.title,
          article.description,
          article.content,
          article.category,
          article.source,
          ...(article.tags || [])
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(search);
      });
  }

  // ============================================================
  // SEARCH
  // ============================================================

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {

    this.searchTerm = '';

    this.applyFilters();
  }

  // ============================================================
  // CATEGORY
  // ============================================================

  selectCategory(category: string = 'All'): void {

    this.selectedCategory =
      category || 'All';

    this.applyFilters();
  }

  // ============================================================
  // FEATURED
  // ============================================================

  get featuredArticle(): NewsArticle | null {

    const featured =
      this.filteredArticles.find(
        article => article.featured === true
      );

    return featured ||
      this.filteredArticles[0] ||
      null;
  }

  // ============================================================
  // LATEST
  // ============================================================

  get latestArticles(): NewsArticle[] {

    const featuredId =
      this.featuredArticle?.id;

    return this.filteredArticles.filter(
      article => article.id !== featuredId
    );
  }

  // ============================================================
  // CATEGORY COUNT
  // ============================================================

  getCategoryCount(
    category: string = 'All'
  ): number {

    if (!category || category === 'All') {
      return this.articles.length;
    }

    return this.articles.filter(
      article => article.category === category
    ).length;
  }

  // ============================================================
  // ARTICLE READER
  // ============================================================

  openArticle(
    article: NewsArticle | null = null
  ): void {

    if (!article) {
      return;
    }

    this.selectedArticle = article;

    this.disableBodyScroll();
  }

  closeArticle(): void {

    this.selectedArticle = null;

    this.enableBodyScroll();
  }

  // ============================================================
  // ORIGINAL ARTICLE
  // ============================================================

  openOriginal(
    article: NewsArticle | null = null
  ): void {

    if (!article?.url) {
      return;
    }

    window.open(
      article.url,
      '_blank',
      'noopener,noreferrer'
    );
  }

  // ============================================================
  // SHARE
  // ============================================================

  async shareArticle(
    article: NewsArticle | null = null
  ): Promise<void> {

    if (!article) {
      return;
    }

    const url =
      article.url ||
      window.location.href;

    try {

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function'
      ) {

        await navigator.share({
          title: article.title,
          text: article.description,
          url
        });

        return;
      }

      await this.copyToClipboard(url);

    } catch {
      // Sharing cancelled or unavailable.
    }
  }

  private async copyToClipboard(
    value: string
  ): Promise<void> {

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard
    ) {

      await navigator.clipboard.writeText(value);

      return;
    }

    const textarea =
      document.createElement('textarea');

    textarea.value = value;

    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    } catch {
      // Ignore clipboard failure.
    }

    textarea.remove();
  }

  // ============================================================
  // IMAGE ERROR
  // ============================================================

  handleImageError(
    article: NewsArticle | null = null
  ): void {

    if (!article) {
      return;
    }

    if (article.image === this.defaultImage) {
      return;
    }

    article.image = this.defaultImage;
  }

  // ============================================================
  // KEYBOARD
  // ============================================================

  @HostListener('document:keydown.escape')
  handleEscape(): void {

    if (this.selectedArticle) {
      this.closeArticle();
    }
  }

  // ============================================================
  // BODY SCROLL
  // ============================================================

  private disableBodyScroll(): void {

    if (
      typeof document === 'undefined'
    ) {
      return;
    }

    document.body.style.overflow = 'hidden';
  }

  private enableBodyScroll(): void {

    if (
      typeof document === 'undefined'
    ) {
      return;
    }

    document.body.style.overflow = '';
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByArticleId(
    index: number,
    article: NewsArticle
  ): number {

    return article.id;
  }

  // ============================================================
  // CURRENT TIME
  // ============================================================

  private getCurrentTime(): string {

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(new Date());
  }

  // ============================================================
  // TIME AGO
  // ============================================================

  getTimeAgo(
    publishedAt: string = ''
  ): string {

    if (!publishedAt) {
      return '';
    }

    const date =
      new Date(publishedAt);

    if (isNaN(date.getTime())) {
      return publishedAt;
    }

    const now = new Date();

    const difference =
      now.getTime() -
      date.getTime();

    // Future date
    if (difference < 0) {
      return 'Just now';
    }

    const minutes =
      Math.floor(
        difference /
        (1000 * 60)
      );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);
  }

  // ============================================================
  // CATEGORY CSS CLASS
  // ============================================================

  getCategoryClass(
    category: string = ''
  ): string {

    return (category || '')
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  // ============================================================
  // SOURCE INITIAL
  // ============================================================

  getSourceInitial(
    source: string = ''
  ): string {

    if (!source) {
      return 'G';
    }

    return source
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  // ============================================================
  // ARTICLE PARAGRAPHS
  // ============================================================

  getArticleParagraphs(
    article: NewsArticle | null = null
  ): string[] {

    if (!article?.content) {
      return [];
    }

    return article.content
      .split(/\n\s*\n/)
      .map(paragraph =>
        paragraph.trim()
      )
      .filter(Boolean);
  }

  // ============================================================
  // READING TIME
  // ============================================================

  calculateReadTime(
    article: NewsArticle | null = null
  ): number {

    if (!article) {
      return 1;
    }

    if (article.readTime > 0) {
      return article.readTime;
    }

    const words =
      (article.content || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    return Math.max(
      1,
      Math.ceil(words / 200)
    );
  }

  // ============================================================
  // BREAKING STORIES
  // ============================================================

  get breakingArticles(): NewsArticle[] {

    return this.articles
      .filter(article =>
        article.breaking === true
      )
      .slice(0, 4);
  }

  // ============================================================
  // STORIES BY CATEGORY
  // ============================================================

  getArticlesByCategory(
    category: string = ''
  ): NewsArticle[] {

    if (!category) {
      return [];
    }

    return this.articles.filter(
      article =>
        article.category === category
    );
  }

  // ============================================================
  // TOTAL STORIES
  // ============================================================

  get totalStories(): number {

    return this.articles.length;
  }

  // ============================================================
  // TOTAL CATEGORIES
  // ============================================================

  get totalCategories(): number {

    return this.categories.length - 1;
  }

  // ============================================================
  // REFRESH
  // ============================================================

  refreshNews(): void {

    this.loadNews();
  }
}
