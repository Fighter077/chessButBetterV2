import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmComponent } from "./confirm.component";
import { Observable } from "rxjs";

export const openConfirmDialog = (
    dialog: MatDialog,
    confirmTitle: string | undefined,
    confirmText: string | undefined,
    confirmButtonText: string | undefined,
    onConfirm?: () => Observable<any> | void
  ): MatDialogRef<ConfirmComponent> => {
    //set default values if undefined
    confirmTitle = confirmTitle || "Confirm";
    confirmText = confirmText || "Are you sure?";
    confirmButtonText = confirmButtonText || "OK";

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
  