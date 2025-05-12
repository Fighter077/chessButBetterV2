import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { LoginDto, RegisterDto, SessionDto, User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading/loading.service';
import { CookiesService } from '../cookies/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.userApiUrl + '/authentication';
  private userUrl = environment.userApiUrl + '/user';
  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient, private loadingService: LoadingService, private cookiesService: CookiesService) { }

  getSessionID(): string | null {
    return this.cookiesService.getCookie('sessionID');
  }

  fetchCurrentUser(): Observable<User | null> {
    return this.http.get<User>(this.userUrl).pipe(
      tap(user => {
        this.userSubject.next(user);           // emit user
        this.loadingService.stop('user');      // only THEN stop loading
      }),
      catchError(err => {
        if (err.status === 401) {
          this.cookiesService.deleteCookie('sessionID'); // Remove session ID from local storage
        } else {
          console.error('Error fetching user:', err);    // Log other errors
        }
        this.userSubject.next(null);           // anonymous
        this.loadingService.stop('user');      // still stop loading
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  login(loginData: LoginDto): Observable<User> {
    return this.http.post<SessionDto>(`${this.apiUrl}/login`, loginData).pipe(
      tap(session => {
        this.cookiesService.setCookie('sessionID', session.sessionId);
      }),
      switchMap(() => this.fetchCurrentUser().pipe(
        tap(user => this.userSubject.next(user)),
        filter((user): user is User => user !== null) // Filter out null values
      ))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.cookiesService.deleteCookie('sessionID'); // Remove session ID from local storage
        this.userSubject.next(null);
      })
    );
  }

  register(registerData: RegisterDto): Observable<User> {
    return this.http.post<SessionDto>(`${this.apiUrl}/register`, registerData).pipe(
      tap(user => {
        this.cookiesService.setCookie('sessionID', user.sessionId); // Store user data in local storage
      }),
      switchMap(() => this.fetchCurrentUser().pipe(
        tap(user => this.userSubject.next(user)),
        filter((user): user is User => user !== null) // Filter out null values
      ))
    );
  }

  createTempAccount(): Observable<User> {
    return this.http.post<SessionDto>(`${this.apiUrl}/temp`, {}).pipe(
      tap(session => {
        this.cookiesService.setCookie('sessionID', session.sessionId); // Store user data in local storage
      }),
      switchMap(() => this.fetchCurrentUser().pipe(
        tap(user => this.userSubject.next(user)),
        filter((user): user is User => user !== null) // Filter out null values
      ))
    );
  }
}
