import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth.service.js';

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  notifications: boolean;
  emailNotifications: boolean;
  privacyMode: boolean;
}

interface UserStats {
  collections: number;
  items: number;
  favorites: number;
}

@Component({
  selector: 'app-profile-design',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-design.component.html',
  styleUrl: './profile-design.component.css'
})
export class ProfileDesignComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profilePicture: string = '';
  isDarkTheme: boolean = false;
  isPhotoSaved: boolean = false;
  
  userProfile: UserProfile = {
    username: 'MediaShelf Kullanıcısı',
    email: 'user@mediashelf.com',
    bio: 'Medya koleksiyonumu yönetiyorum ve yeni içerikler keşfediyorum.',
    notifications: true,
    emailNotifications: false,
    privacyMode: false
  };

  userStats: UserStats = {
    collections: 5,
    items: 23,
    favorites: 12
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadThemePreference();
    this.loadProfileData();
    this.loadCurrentUser();
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveThemePreference();
  }

  private applyTheme(): void {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  private saveThemePreference(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profilePicture = e.target.result;
          this.isPhotoSaved = false; // Fotoğraf yüklendi, henüz kaydedilmedi
        };
        reader.readAsDataURL(file);
      } else {
        alert('Lütfen geçerli bir resim dosyası seçin.');
      }
    }
  }

  removeProfilePicture(): void {
    this.profilePicture = '';
    this.isPhotoSaved = false; // Fotoğraf kaldırıldı
    this.authService.clearProfilePicture();
    localStorage.removeItem('profilePicture');
    this.showNotification('Profil fotoğrafı kaldırıldı!', 'info');
  }

  saveProfilePicture(): void {
    localStorage.setItem('profilePicture', this.profilePicture);
    this.authService.setProfilePicture(this.profilePicture);
    this.isPhotoSaved = true; // Fotoğraf kaydedildi
    this.showNotification('Profil fotoğrafı kaydedildi!', 'success');
  }

  private loadProfileData(): void {
    const storedFromService = this.authService.getProfilePicture();
    if (storedFromService) {
      this.profilePicture = storedFromService;
      this.isPhotoSaved = true;
    } else {
      const savedPicture = localStorage.getItem('profilePicture');
      if (savedPicture) {
        this.profilePicture = savedPicture;
        this.isPhotoSaved = true; // Kaydedilmiş fotoğraf yüklendi
      }
    }

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
    }
  }

  private loadCurrentUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile.username = currentUser.username;
      this.userProfile.email = currentUser.email;
    }
  }

  saveProfile(): void {
    // Backend'e profil güncellemesi gönder
    const updateData = {
      fullName: this.userProfile.username,
      email: this.userProfile.email
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (updatedUser: User) => {
        console.log('Profile updated:', updatedUser);
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        this.showNotification('Profil başarıyla kaydedildi!', 'success');
      },
      error: (error: unknown) => {
        console.error('Profile update failed:', error);
        const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
        this.showNotification('Profil güncellenemedi: ' + message, 'error');
      }
    });
  }

  resetProfile(): void {
    if (confirm('Tüm değişiklikleri sıfırlamak istediğinizden emin misiniz?')) {
      this.userProfile = {
        username: 'MediaShelf Kullanıcısı',
        email: 'user@mediashelf.com',
        bio: 'Medya koleksiyonumu yönetiyorum ve yeni içerikler keşfediyorum.',
        notifications: true,
        emailNotifications: false,
        privacyMode: false
      };
      this.profilePicture = '';
      localStorage.removeItem('userProfile');
      localStorage.removeItem('profilePicture');
      this.authService.clearProfilePicture();
      this.showNotification('Profil sıfırlandı!', 'info');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    // Basit bir notification sistemi
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}