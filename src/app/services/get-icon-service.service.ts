import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetIconServiceService {

  constructor() { }

  getIconUrl(s: string): string {
    return 'url(assets/icons/' + s + '.svg)';
  }
}
