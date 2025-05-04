import { Component } from '@angular/core';
import { LinkComponent } from "../../components/link/link.component";

@Component({
  selector: 'app-privacy-policy',
  imports: [LinkComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  lastUpdated: string = 'May 2025';
  contactEmail: string = 'contact@chessbutbetter.com';
  contactPhone: string = '+1 (123) 456-7890';
  contactAddress: string = '123 Chess St, Chess City, CC 12345';
}
