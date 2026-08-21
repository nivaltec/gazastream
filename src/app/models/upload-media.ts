import { UploadAudioType } from "../enums/upload-audio-type-enum";
import { UploadContentType } from "../enums/upload-content-type.-enum";
import { UploadStatus } from "../enums/upload-status-enum";

export interface UploadAlbumTrack {
  id: string;
  file: File;
  title: string;
  trackNumber: number;
  duration?: number;
  status: UploadStatus;
  progress: number;
}

export interface UploadProgress {
  progress: number;
  status: UploadStatus;
  message?: string;
}


export interface UploadResponse {
  id: string;
  title: string;
  type: UploadContentType;
  status: UploadStatus;
  message?: string;
}

export interface UploadFormData {
  contentType: UploadContentType;
  audioType?: UploadAudioType;
  title: string;
  artist?: string;
  album?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  artwork?: File | null;
  mediaFile?: File | null;
  tracks?: UploadAlbumTrack[];
}


export interface UploadCompletedResult {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  description?: string;
  contentType: UploadContentType;
  isPodcast: boolean;
  audioType?: UploadAudioType;
  fileName?: string;
  trackCount?: number;
  status: UploadStatus;
  progress: number;
  createdAt: Date;
}
