import { Injectable } from '@angular/core';
import {HttpClient,HttpEventType,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadStatus } from '../enums/upload-status-enum';
import {UploadFormData,UploadProgress} from '../models/upload-media';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private readonly apiUrl = '/api/media';

  constructor(
    private readonly http: HttpClient
  ) {}

  getUploads(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  uploadPodcast(
    data: UploadFormData
  ): Observable<UploadProgress> {
    return this.upload(
      `${this.apiUrl}/podcasts`,
      this.buildFormData(data)
    );
  }

  uploadAudio(
    data: UploadFormData
  ): Observable<UploadProgress> {
    return this.upload(
      `${this.apiUrl}/audio`,
      this.buildFormData(data)
    );
  }

  uploadAlbum(
    data: UploadFormData
  ): Observable<UploadProgress> {
    const formData = this.buildFormData(data);

    data.tracks?.forEach(track => {
      formData.append(
        'tracks',
        track.file,
        track.file.name
      );

      formData.append(
        'trackTitles',
        track.title
      );

      formData.append(
        'trackNumbers',
        track.trackNumber.toString()
      );
    });

    return this.upload(
      `${this.apiUrl}/albums`,
      formData
    );
  }

  uploadVideo(
    data: UploadFormData
  ): Observable<UploadProgress> {
    return this.upload(
      `${this.apiUrl}/videos`,
      this.buildFormData(data)
    );
  }

  private upload(
    url: string,
    formData: FormData
  ): Observable<UploadProgress> {
    const request = new HttpRequest(
      'POST',
      url,
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request(request).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total ?? 1;
          const progress = Math.round(
            (event.loaded / total) * 100
          );

          return {
            progress,
            status:
              progress >= 100
                ? UploadStatus.Processing
                : UploadStatus.Uploading
          };
        }

        if (event.type === HttpEventType.Response) {
          return {
            progress: 100,
            status: UploadStatus.Completed,
            message:
              (event as any).body?.message ??
              'Upload completed successfully.'
          };
        }

        return {
          progress: 0,
          status: UploadStatus.Pending
        };
      })
    );
  }

  private buildFormData(
    data: UploadFormData
  ): FormData {
    const formData = new FormData();

    formData.append(
      'contentType',
      data.contentType
    );

    if (data.contentType) {
      formData.append(
        'podcastType',
        data.contentType
      );
    }

    if (data.audioType) {
      formData.append(
        'audioType',
        data.audioType
      );
    }

    formData.append(
      'title',
      data.title
    );

    if (data.artist) {
      formData.append(
        'artist',
        data.artist
      );
    }

    if (data.album) {
      formData.append(
        'album',
        data.album
      );
    }

    if (data.description) {
      formData.append(
        'description',
        data.description
      );
    }

    if (data.genre) {
      formData.append(
        'genre',
        data.genre
      );
    }

    if (data.releaseDate) {
      formData.append(
        'releaseDate',
        data.releaseDate
      );
    }

    if (data.artwork) {
      formData.append(
        'artwork',
        data.artwork,
        data.artwork.name
      );
    }

    if (data.mediaFile) {
      formData.append(
        'file',
        data.mediaFile,
        data.mediaFile.name
      );
    }

    return formData;
  }
}
