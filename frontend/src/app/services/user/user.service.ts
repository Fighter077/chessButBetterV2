import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, switchMap, tap } from 'rxjs';
import { LoginDto, RegisterDto, SessionDto, User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class Userservice {

  private apiUrl = environment.userApiUrl + '/authentication';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl).pipe(
      tap(user => {
        this.userSubject.next(user);
      }),
      finalize(() => {
        this.loadingService.stop('user');
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  login(loginData: LoginDto): Observable<User> {
    return this.http.post<SessionDto>(`${this.apiUrl}/login`, loginData).pipe(
      tap(session => {
        localStorage.setItem('sessionID', session.sessionId);
      }),
      switchMap(() => this.fetchCurrentUser().pipe(
        tap(user => this.userSubject.next(user))
      ))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('sessionID'); // Remove session ID from local storage
        this.userSubject.next(null);
      })
    );
  }

  register(registerData: RegisterDto): Observable<User> {
    return this.http.post<SessionDto>(`${this.apiUrl}/register`, registerData).pipe(
      tap(user => {
        localStorage.setItem('sessionID', user.sessionId); // Store user data in local storage
      }),
      switchMap(() => this.fetchCurrentUser().pipe(
        tap(user => this.userSubject.next(user)) // Store user data globally
      ))
    );
  }
}
