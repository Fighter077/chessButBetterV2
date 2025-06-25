import { Component, Inject } from '@angular/core';
import { LoadingButtonComponent } from "../../loading-button/loading-button.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  imports: [
    LoadingButtonComponent,
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  constructor(
    private dialogRef: MatDialogRef<InfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      infoTitle: string;
      infoText: string[];
    }
  ) { }

  close() {
    this.dialogRef.close();
  }
}
