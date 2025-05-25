import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { supportedLanguages } from 'src/app/constants/languages.constants';
import { CookiesService } from 'src/app/services/cookies/cookies.service';

@Component({
  selector: 'app-language-redirect',
  imports: [],
  templateUrl: './language-redirect.component.html',
  styleUrl: './language-redirect.component.scss'
})
export class LanguageRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cookiesService: CookiesService
  ) { }

  ngOnInit(): void {
    const lang = this.route.snapshot.paramMap.get('lang') || 'en';

    // Validate the language code
    if (supportedLanguages.indexOf(lang) === -1) {
      console.warn(`Unsupported language: ${lang}. Redirecting to default language.`);
      this.router.navigate(['/']);
      return;
    }
    this.cookiesService.setCookie('selectedLanguage', lang);

    // Get full URL and strip the first segment (the language)
    const fullSegments = this.route.snapshot.url.map(segment => segment.path);
    const subRouteSegments = fullSegments.slice(1); // remove 'language', keep the rest

    const newUrl = '/' + subRouteSegments.join('/');

    this.translate.use(lang).subscribe(() => {
      this.router.navigateByUrl(newUrl || '/');
    });
  }
}