import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { CookiesService } from '../cookies/cookies.service';
import { BackgroundList, BackgroundOption } from 'src/app/interfaces/background';


@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private backgrounds$!: Observable<BackgroundList>;
  public backgrounds: BackgroundList | null = null;
  public background: BehaviorSubject<BackgroundOption | null> = new BehaviorSubject<BackgroundOption | null>(null);


  constructor(@Inject(HttpClient) private http: HttpClient, private cookiesService: CookiesService) {
    Promise.all([
      this.getBackgrounds().toPromise(),
    ]).then(async ([backgrounds]) => {
      const selectedBackground = (await this.getSelectedBackground() || (backgrounds as BackgroundList)[0]);
      if (backgrounds) {
        this.background.next(selectedBackground);
      }
    });
  }

  getBackgrounds(): Observable<BackgroundList> {
    if (!this.backgrounds) {
      this.backgrounds$ = this.http.get<BackgroundList>('assets/background-images/images.json').pipe(
        tap((backgrounds: BackgroundList) => {
          this.backgrounds = backgrounds;
        }),
        shareReplay(1)
      );
    }
    return this.backgrounds$;
  }

  setBackground(backgroundName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookiesService.setCookie('selectedBackground', backgroundName);
      const selectedBackground = this.getBackgroundByName(backgroundName);
      if (!selectedBackground) {
        reject(new Error(`Background not found: ${backgroundName}`));
        return;
      }
      this.background.next(selectedBackground);
    });
  }

  getBackgroundByName(backgroundName: string): BackgroundOption | undefined {
    for (const background of this.backgrounds || []) {
      if (background.name === backgroundName) {
        return background;
      }
    }
    return undefined;
  }

  async getSelectedBackground(): Promise<BackgroundOption | null> {
    const backgroundName = await this.cookiesService.getCookie('selectedBackground');
    if (backgroundName) {
      const background = this.getBackgroundByName(backgroundName);
      if (background) {
        return background;
      }
    }
    return null;
  }
}