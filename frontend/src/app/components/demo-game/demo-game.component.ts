import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DemoGame, Game, Move } from 'src/app/interfaces/game';
import { GameComponent } from 'src/app/pages/play/components/game/game.component';
import { GameService } from 'src/app/services/game/game.service';
import { LoadingButtonComponent } from "../loading-button/loading-button.component";
import { IconComponent } from "../../icons/icon.component";
import { expandCollapse, fadeInOut } from 'src/app/animations/fade.animation';
import { openInfoDialog } from '../dialogs/info/openInfodialog.helper';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
	animations: [fadeInOut(), expandCollapse('horizontal', 0, 'both', 30000)],
	selector: 'app-demo-game',
	imports: [
		CommonModule,
		GameComponent,
		LoadingButtonComponent,
		IconComponent
	],
	templateUrl: './demo-game.component.html',
	styleUrl: './demo-game.component.scss'
})
export class DemoGameComponent implements OnInit, OnChanges, OnDestroy {

	private breakpointObserver = inject(BreakpointObserver);

	@Input()
	game: Game | null | "demo" = null;

	demoGame: DemoGame = {
		id: 0,
		player1: {
			id: 0,
			username: 'Player 1'
		},
		player2: {
			id: 1,
			username: 'Player 2'
		},
		moves: [],
		demoInfo: "",
		result: null
	}

	infoInside$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall])
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	demoMoves: Move[] = [];
	currentDemoMoveIndex: number = 0;

	timeOut: any | null = null;

	constructor(private gameService: GameService, private dialog: MatDialog, private translateService: TranslateService) { }

	ngOnInit() {
		if (this.game === "demo") {
			this.loadDemoGame();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['game'] && !changes['game'].firstChange && changes['game'].currentValue === "demo" && changes['game'].previousValue !== "demo") {
			this.loadDemoGame();
		} else if (changes['game'] && changes['game'].currentValue && changes['game'].currentValue !== "demo") {
			this.currentDemoMoveIndex = 0;
			this.demoGame = {
				...this.demoGame,
				moves: []
			};
			if (this.timeOut) {
				clearTimeout(this.timeOut);
				this.timeOut = null;
			}
		}
	}

	loadDemoGame() {
		this.gameService.loadDemoGame().subscribe({
			next: (game: DemoGame) => {
				this.currentDemoMoveIndex = 0;
				this.demoGame = {
					...game,
					moves: []
				};
				this.demoMoves = game.moves;
				this.startDemoGame(true);
			},
			error: (err: any) => {
				console.error('Error loading demo game:', err);
			}
		});
	}

	startDemoGame(initial: boolean = false) {
		if (this.timeOut) {
			clearTimeout(this.timeOut);
			this.timeOut = null;
		}
		this.timeOut = setTimeout(() => {
			if (this.demoMoves.length > 0) {
				this.demoGame = {
					...this.demoGame,
					moves: [...this.demoGame.moves, this.demoMoves[this.currentDemoMoveIndex]]
				}
				this.currentDemoMoveIndex++;
				if (this.currentDemoMoveIndex < this.demoMoves.length) {
					this.startDemoGame();
				}
			}
		}, (initial ? 1500 : 2500));
	}

	infoClicked() {
		if (this.demoGame.demoInfo === "") {
			return;
		}
		const titleSplit = this.demoGame.demoInfo.split('; ');
		const title = titleSplit[0] ? titleSplit[0] : '';
		const location = titleSplit[1] ? titleSplit[1] : '';
		titleSplit.splice(0, 2);
		const additionalInfo = titleSplit.splice(0, 2);
		openInfoDialog(
			this.dialog,
			this.translateService,
			title,
			[
				this.translateService.instant('GAME.LOCATION', { "location": location }),
				...additionalInfo,
				this.translateService.instant('GAME.WHITE_PLAYER', { "player_name": this.demoGame.player1.username }),
				this.translateService.instant('GAME.BLACK_PLAYER', { "player_name": this.demoGame.player2.username }),
				this.demoGame.startTime ? this.translateService.instant('GAME.PLAYED', { "played": new Date(this.demoGame.startTime).toLocaleDateString() }) : ''
			],
			false
		);
	}

	ngOnDestroy() {
		if (this.timeOut) {
			clearTimeout(this.timeOut);
			this.timeOut = null;
		}
	}
}
