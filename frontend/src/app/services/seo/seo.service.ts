
import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { supportedLanguages } from 'src/app/constants/languages.constants';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  baseUrl: string = 'https://www.chessbutbetter.com';

  constructor(private meta: Meta, private title: Title,
    @Inject(DOCUMENT) private document: Document, private router: Router) { }

  updateMeta(titleText: string | Observable<string>, description: string | Observable<string>) {
    // If titleText is an Observable, subscribe to it and update the title
    if (titleText instanceof Observable) {
      titleText.subscribe(text => this.title.setTitle(text));
    } else {
      this.title.setTitle(titleText);
    }
    // If description is an Observable, subscribe to it and update the meta tag
    if (description instanceof Observable) {
      description.subscribe(desc => this.meta.updateTag({ name: 'description', content: desc }));
    } else {
      this.meta.updateTag({ name: 'description', content: description });
    }
  }

  updateHreflangTags() {
    // Remove existing hreflang tags
    const links = this.document.querySelectorAll('link[rel="alternate"]');
    links.forEach(link => link.parentNode?.removeChild(link));

    // Get current path (excluding language)
    const urlTree = this.router.parseUrl(this.router.url);
    const pathSegments = urlTree.root.children['primary']?.segments || [];
    const firstSegment = pathSegments.length > 0 ? pathSegments[0].path : '';
    const currentPathWithoutLang = pathSegments.slice(supportedLanguages.includes(firstSegment) ? 1 : 0).map(s => s.path).join('/');

    supportedLanguages.forEach(lang => {
      const linkEl = this.document.createElement('link');
      linkEl.setAttribute('rel', 'alternate');
      linkEl.setAttribute('hreflang', lang);
      linkEl.setAttribute('href', `${this.baseUrl}/${lang}/${currentPathWithoutLang}`);
      this.document.head.appendChild(linkEl);
    });

    // Optional: Add x-default
    const defaultLink = this.document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', `${this.baseUrl}/${currentPathWithoutLang}`);
    this.document.head.appendChild(defaultLink);
  }
}
