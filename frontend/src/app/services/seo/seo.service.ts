import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta, private title: Title) { }

  updateMeta(titleText: string, description: string) {
    this.title.setTitle(titleText);
    this.meta.updateTag({ name: 'description', content: description });
  }
}
