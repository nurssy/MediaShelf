import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Collection {
  id: number;
  name: string;
  icon: string;
  createdDate: Date;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  isMenuOpen = false;
  isCollectionModalOpen = false;
  isDeleteCollectionModalOpen = false;
  
  collections: Collection[] = [
    { id: 1, name: 'Kitaplar', icon: '📖', createdDate: new Date() },
    { id: 2, name: 'Filmler', icon: '🎬', createdDate: new Date() },
    { id: 3, name: 'Diziler', icon: '📺', createdDate: new Date() },
    { id: 4, name: 'Anime', icon: '🎌', createdDate: new Date() },
    { id: 5, name: 'Müzik', icon: '🎵', createdDate: new Date() }
  ];
  
  nextId = 6;
  collectionToDelete: Collection | null = null;
  
  newCollection = {
    name: '',
    icon: ''
  };
  
  availableIcons = ['📚', '📖', '🎬', '📺', '🎌', '🎵', '🎮', '🎨', '🏃', '🍳', '✈️', '🏠', '💻', '📱', '🎭', '🎪', '🏛️', '🌍', '🚗', '🚲'];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openCollectionModal() {
    this.isCollectionModalOpen = true;
    this.resetCollectionForm();
  }

  closeCollectionModal() {
    this.isCollectionModalOpen = false;
    this.resetCollectionForm();
  }

  resetCollectionForm() {
    this.newCollection.name = '';
    this.newCollection.icon = '';
  }

  selectIcon(icon: string) {
    this.newCollection.icon = icon;
  }

  addCollection() {
    if (!this.newCollection.name.trim() || !this.newCollection.icon) {
      return;
    }

    const newCollectionItem: Collection = {
      id: this.nextId++,
      name: this.newCollection.name.trim(),
      icon: this.newCollection.icon,
      createdDate: new Date()
    };

    this.collections.push(newCollectionItem);
    this.closeCollectionModal();
  }

  openDeleteCollectionModal(collection: Collection) {
    this.collectionToDelete = collection;
    this.isDeleteCollectionModalOpen = true;
  }

  closeDeleteCollectionModal() {
    this.isDeleteCollectionModalOpen = false;
    this.collectionToDelete = null;
  }

  confirmDeleteCollection() {
    if (this.collectionToDelete) {
      this.removeCollection(this.collectionToDelete.id);
      this.closeDeleteCollectionModal();
    }
  }

  removeCollection(collectionId: number) {
    this.collections = this.collections.filter(collection => collection.id !== collectionId);
  }

  trackByCollectionId(index: number, collection: Collection): number {
    return collection.id;
  }
}
