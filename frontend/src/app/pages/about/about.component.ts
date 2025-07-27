import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LinkComponent } from "../../components/link/link.component";
import { LinkedinLogoComponent } from "../../components/brands/linkedin-logo/linkedin-logo.component";
import { InstagramLogoComponent } from "../../components/brands/instagram-logo/instagram-logo.component";
import { LogoComponent } from "../../components/logo/logo.component";

@Component({
  selector: 'app-about',
  imports: [
    TranslateModule,
    LinkComponent,
    LogoComponent
],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  contactEmail: string = 'contact@chessbutbetter.com';
}
