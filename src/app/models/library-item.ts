export interface LibraryItem {
  id: string;
  name: string;
  icon: string;
  route: string;
  description: string | undefined;
  trackCount: number | undefined;
  artwork: string | undefined;
}
