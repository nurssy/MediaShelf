import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id?: string;
  username: string;
  email: string;
  fullName?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly STORAGE_KEY = 'auth_user';
  private static readonly STORAGE_PROFILE_PICTURE = 'profilePicture';

  private currentUserSubject: BehaviorSubject<User | null>;
  private profilePictureSubject: BehaviorSubject<string | null>;

  constructor() {
    const stored = localStorage.getItem(AuthService.STORAGE_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(stored ? JSON.parse(stored) : null);

    // Initialize with a default demo user if none exists to avoid nulls
    if (!this.currentUserSubject.value) {
      const defaultUser: User = {
        id: 'demo',
        username: 'MediaShelf Kullanıcısı',
        email: 'user@mediashelf.com',
        fullName: 'MediaShelf Kullanıcısı'
      };
      this.setCurrentUser(defaultUser);
    }

    const storedPic = localStorage.getItem(AuthService.STORAGE_PROFILE_PICTURE);
    this.profilePictureSubject = new BehaviorSubject<string | null>(storedPic || null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  updateProfile(update: UpdateProfileRequest): Observable<User> {
    const current = this.currentUserSubject.value as User;
    const updated: User = {
      ...current,
      fullName: update.fullName ?? current.fullName,
      email: update.email ?? current.email,
      // keep username aligned with fullName if provided by UI expecting username edits
      username: update.fullName ?? current.username
    };
    this.setCurrentUser(updated);
    // Simulate backend latency; replace with HttpClient call when API is ready
    return of(updated).pipe(delay(200));
  }

  getProfilePicture$(): Observable<string | null> {
    return this.profilePictureSubject.asObservable();
  }

  getProfilePicture(): string | null {
    return this.profilePictureSubject.value;
  }

  setProfilePicture(dataUrl: string): void {
    this.profilePictureSubject.next(dataUrl);
    localStorage.setItem(AuthService.STORAGE_PROFILE_PICTURE, dataUrl);
  }

  clearProfilePicture(): void {
    this.profilePictureSubject.next(null);
    localStorage.removeItem(AuthService.STORAGE_PROFILE_PICTURE);
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AuthService.STORAGE_KEY);
    }
  }
}


