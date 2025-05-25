import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmComponent } from "./confirm.component";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

export const openConfirmDialog = (
    dialog: MatDialog,
    translate: TranslateService,
    confirmTitle: string | undefined,
    confirmText: string[] | undefined,
    confirmButtonText: string | undefined,
    onConfirm?: () => Observable<any> | void
  ): MatDialogRef<ConfirmComponent> => {
    //set default values if undefined
    confirmTitle = confirmTitle ? translate.instant(confirmTitle) : translate.instant("CONFIRM");
    confirmText = confirmText ? confirmText.map(text => translate.instant(text)) : [translate.instant("ARE_YOU_SURE")];
    confirmButtonText = confirmButtonText ? translate.instant(confirmButtonText) : translate.instant("OK");

    //open dialog with data
    return dialog.open(ConfirmComponent, {
      data: {
        confirmTitle,
        confirmText,
        confirmButtonText,
        onConfirm
      }
    });
  };
  