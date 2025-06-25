import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { InfoComponent } from "./info.component";

export const openInfoDialog = (
	dialog: MatDialog,
	translate: TranslateService,
	infoTitle: string,
	infoText: string[],
	noTranslate: boolean = false
): MatDialogRef<InfoComponent> => {
	//set default values if undefined
	if (!noTranslate) {
		infoTitle = translate.instant(infoTitle);
		infoText = infoText.map(text => translate.instant(text));
	}

	//open dialog with data
	return dialog.open(InfoComponent, {
		data: {
			infoTitle,
			infoText
		}
	});
};
