import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  private readonly currentUserSubject = new BehaviorSubject<
    AuthResponse['user'] | null
  >(this.getStoredUser());

  readonly currentUser$ = this.currentUserSubject.asObservable();
  notificationCount: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  /* ============================================================
     LOGIN
     ============================================================ */

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.storeAuthentication(response, request.rememberMe);
      }),
    );
  }

  /* ============================================================
     REGISTER
     ============================================================ */

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap((response) => {
          this.storeAuthentication(response, true);
        }),
      );
  }

  /* ============================================================
     GOOGLE
     ============================================================ */

  loginWithGoogle(): void {
    this.startOAuth('google');
  }

  /* ============================================================
     FACEBOOK
     ============================================================ */

  loginWithFacebook(): void {
    this.startOAuth('facebook');
  }

  /* ============================================================
     APPLE
     ============================================================ */

  loginWithApple(): void {
    this.startOAuth('apple');
  }

  /* ============================================================
     OAUTH
     ============================================================ */

  private startOAuth(provider: 'google' | 'facebook' | 'apple'): void {
    window.location.href = `${this.apiUrl}/oauth/${provider}`;
  }

  /* ============================================================
     LOGOUT
     ============================================================ */

  logout(): void {
    localStorage.removeItem('gaza_stream_token');
    localStorage.removeItem('gaza_stream_refresh_token');
    localStorage.removeItem('gaza_stream_user');

    sessionStorage.removeItem('gaza_stream_token');
    sessionStorage.removeItem('gaza_stream_refresh_token');
    sessionStorage.removeItem('gaza_stream_user');

    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  /* ============================================================
     TOKEN
     ============================================================ */

  getToken(): string | null {
    return (
      localStorage.getItem('gaza_stream_token') ??
      sessionStorage.getItem('gaza_stream_token')
    );
  }

  /* ============================================================
     AUTHENTICATED
     ============================================================ */

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /* ============================================================
     CURRENT USER
     ============================================================ */

  getCurrentUser(): AuthResponse['user'] | null {
    return this.currentUserSubject.value;
  }

  /* ============================================================
     STORE AUTHENTICATION
     ============================================================ */

  private storeAuthentication(
    response: AuthResponse,
    rememberMe: boolean,
  ): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('gaza_stream_token', response.token);

    if (response.refreshToken) {
      storage.setItem('gaza_stream_refresh_token', response.refreshToken);
    }

    storage.setItem('gaza_stream_user', JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
  }

  /* ============================================================
     STORED USER
     ============================================================ */

  private getStoredUser(): AuthResponse['user'] | null {
    const stored =
      localStorage.getItem('gaza_stream_user') ??
      sessionStorage.getItem('gaza_stream_user');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
}
