import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreeTerms: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

 

  onRegister() {
    if (!this.fullName || !this.email || !this.username || !this.password || !this.confirmPassword) {
      alert('Lütfen tüm alanları doldurunuz!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    if (!this.agreeTerms) {
      alert('Kullanım şartlarını kabul etmelisiniz!');
      return;
    }

    this.isLoading = true;
    
    // Simüle edilmiş kayıt işlemi
    setTimeout(() => {
      console.log('Registration attempt:', {
        fullName: this.fullName,
        email: this.email,
        username: this.username,
        password: this.password,
        agreeTerms: this.agreeTerms
      });
      
      // Burada gerçek API çağrısı yapılacak
      alert(`Hoş geldiniz, ${this.fullName}! Kayıt işleminiz başarıyla tamamlandı.`);
      
      this.isLoading = false;
      
      // Formu temizle
      this.fullName = '';
      this.email = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.agreeTerms = false;
    }, 1500);
  }
}
