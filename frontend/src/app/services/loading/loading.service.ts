import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingMap = new Map<string, BehaviorSubject<boolean>>();

  // Expose the full loading state as a subscribable object
  readonly states$ = new BehaviorSubject<Record<string, BehaviorSubject<boolean>>>({});

  // Computed: true if any individual loading state is true
  readonly loading$ = this.states$.asObservable().pipe(
    map(states => Object.values(states).some(loading => loading))
  );

  constructor() {
    // Initialize loadingMap with default values if needed
    const initialKeys = ['user'];
    initialKeys.forEach(key => {
      this.set(key, true);  // <-- ensures `states$` is updated
    });
  }

  /** Start loading a specific key */
  start(key: string): void {
    this.set(key, true);
  }

  /** Stop loading a specific key */
  stop(key: string): void {
    this.set(key, false);
  }

  getLoadingState(key: string): Observable<boolean> {
    if (!this.loadingMap.has(key)) {
      this.loadingMap.set(key, new BehaviorSubject<boolean>(true));
      this.updateStates();
    }
    return this.loadingMap.get(key)!.asObservable();
  }

  private set(key: string, value: boolean): void {
    if (!this.loadingMap.has(key)) {
      this.loadingMap.set(key, new BehaviorSubject<boolean>(value));
    } else {
      this.loadingMap.get(key)!.next(value);
    }
    this.updateStates();
  }

  private updateStates(): void {
    // Update the states$ observable with the current map
    const states: Record<string, BehaviorSubject<boolean>> = {};
    for (const [k, subj] of this.loadingMap.entries()) {
      states[k] = subj;
    }
    this.states$.next(states);
  }
}