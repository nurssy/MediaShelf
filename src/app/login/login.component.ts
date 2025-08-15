import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  onLogin() {
    if (!this.username || !this.password) {
      toast.error('Lütfen kullanıcı adı ve şifre giriniz!');
      return;
    }

    this.isLoading = true;

    // Simüle edilmiş login işlemi
    setTimeout(() => {
      console.log('Login attempt:', {
        username: this.username,
        password: this.password,
        rememberMe: this.rememberMe
      });

      // Burada gerçek API çağrısı yapılacak
      toast.success(`Hoş geldiniz, ${this.username}!`);

      this.isLoading = false;
    }, 1500);
  }
}
