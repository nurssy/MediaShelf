import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user2.component.html',
  styleUrl: './user2.component.css'
})
export class User2Component {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
