import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingMap = new Map<string, BehaviorSubject<boolean>>();

  // Expose the full loading state as a derived object
  readonly states$ = new BehaviorSubject<Record<string, boolean>>({});

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

  /** Internal: set loading value for a key */
  private set(key: string, value: boolean): void {
    if (!this.loadingMap.has(key)) {
      this.loadingMap.set(key, new BehaviorSubject<boolean>(value));
    } else {
      this.loadingMap.get(key)!.next(value);
    }

    // Update states$ with current loading status
    const states: Record<string, boolean> = {};
    for (const [k, subj] of this.loadingMap.entries()) {
      states[k] = subj.getValue();
    }
    this.states$.next(states);
  }
}