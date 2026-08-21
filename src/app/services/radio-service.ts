import { Injectable } from '@angular/core';
import { RadioStation } from '../models/radio-station';

@Injectable({
  providedIn: 'root',
})
export class RadioService {
  private stations: RadioStation[] = [
    {
      id: 'MLFM',
      name: 'Munghana Lonene FM',
      description: 'South Africa’s Xitsonga radio station.',
      artwork:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhfZaCHctNkdUGKLxnGnhvZuiP4cG7-0htz9g7mnvsuW0wIcddoRYlcD5&s=10',
      country: 'South Africa',
      language: 'itsonga',
      streamUrl:
        'https://playerservices.streamtheworld.com/api/livestream-redirect/MUNGANALONENEAAC.aac?dist=',
      homepage: 'https://www.munghanalonenefm.co.za/',
    },
    {
      id: 'GCR',
      name: 'Giyani Community Radio',
      description: 'Giyani Community Radio serving communities across Limpopo.',
      artwork:
        'https://static.mytuner.mobi/media/tvos_radios/944/giyani-community-radio-106-fm.c83618f5.png',
      country: 'South Africa',
      language: 'itsonga',
      streamUrl:
        'https://n09.radiojar.com/kgauw4bmb?ver=169028&rj-ttl=5&rj-tok=AAABn_elY14AVpBuoMvR286C4Q',
    },
    {
      id: 'RMEPGAZA',
      name: 'RM EP Gaza',
      description:
        'RM EP de Gaza is a regional public radio station broadcasting from Xai-Xai, Gaza Province, Mozambique',
      artwork:
        'https://streamafrica-production.s3.af-south-1.amazonaws.com/mozambique-radio-ep-de-gaza-tUx0Pv.jpg',
      country: 'Mozambique',
      language: 'itsonga',
      streamUrl: 'https://node.stream-africa.com:8443/Gaza',
    },
  ];

  getStations(): RadioStation[] {
    return this.stations;
  }

  getStation(id: string): RadioStation | undefined {
    return this.stations.find((x) => x.id === id);
  }
}
