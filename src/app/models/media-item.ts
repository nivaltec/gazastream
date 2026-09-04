import { MediaIcon } from '../enums/media-icon-enum';
import { MediaType } from '../enums/media-type-enum';
import { VideoProvider } from './video-provider-enum';

export interface MediaItem {
  views?: number;
  description?: any;
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  artwork: string;
  url: string;
  type: MediaType;
  provider?: VideoProvider;
  duration?: number;
  isLive?: boolean;
  isFavourite?: boolean;
  releaseYear?: number;
  releaseDate?:Date
  mediaIcon:MediaIcon;
}


