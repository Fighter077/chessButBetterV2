import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Userservice {

  private apiUrl = environment.userApiUrl + '/authentication';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient) { }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl).pipe(
      tap(user => this.userSubject.next(user)) // Store user data globally
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
