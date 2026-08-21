export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork?: string;
  icon?: string;
  route?: string;
  trackCount?: number;
  tracks?: string[];
  owner?: string;
}