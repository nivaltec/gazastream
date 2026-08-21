export interface RadioStation {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  country: string;
  language?: string;
  genre?: string[];
  streamUrl: string;
  homepage?: string;
  isLive?: boolean;
  artwork : string
}
