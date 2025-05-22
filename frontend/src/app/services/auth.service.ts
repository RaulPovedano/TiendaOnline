import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string>('');
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStoredUser();
      // Verificar si hay un token al iniciar el servicio
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticatedSubject.next(true);
        // Decodificar el token para obtener el rol
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userRoleSubject.next(payload.role);
        } catch (error) {
          console.error('Error decoding token:', error);
          this.logout();
        }
      }
    }
  }

  private loadStoredUser() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.userSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
          // Decodificar el token para obtener el rol
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          this.userRoleSubject.next(payload.role);
        })
      );
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.userSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
          // Decodificar el token para obtener el rol
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          this.userRoleSubject.next(payload.role);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next('');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  updateUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  isAdmin(): Observable<boolean> {
    return this.userRoleSubject.asObservable().pipe(
      map(role => role === 'ROLE_ADMIN')
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(updatedUser => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          this.userSubject.next(updatedUser);
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  isAdminObservable(): Observable<boolean> {
    return this.userRoleSubject.asObservable().pipe(
      map(role => role === 'ROLE_ADMIN')
    );
  }
} 