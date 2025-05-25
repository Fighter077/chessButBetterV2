import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LinkComponent } from "../../components/link/link.component";
import { LinkedinLogoComponent } from "./linkedin-logo/linkedin-logo.component";
import { InstagramLogoComponent } from "./instagram-logo/instagram-logo.component";

@Component({
  selector: 'app-about',
  imports: [
    TranslateModule,
    LinkComponent,
    LinkedinLogoComponent,
    InstagramLogoComponent
],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  contactEmail: string = 'contact@chessbutbetter.com';
}
