import { Component } from '@angular/core';
import { LinkComponent } from "../../components/link/link.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-licenses',
  imports: [LinkComponent, MatDividerModule],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss'
})
export class LicensesComponent {

}
