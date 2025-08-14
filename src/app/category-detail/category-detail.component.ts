import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Anime {
  id: number;
  name: string;
  image: string;
  addedDate: Date;
  rating: number;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  isMenuOpen = false;
  isModalOpen = false;
  isStatsModalOpen = false;
  isDeleteModalOpen = false;
  selectedImage: string | null = null;
  newAnime = {
    name: '',
    image: null as File | null,
    rating: 0
  };
  
  animeList: Anime[] = [];
  nextId = 1;
  animeToDelete: Anime | null = null;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openAddAnimeModal() {
    this.isModalOpen = true;
    this.resetForm();
  }

  openStatsModal() {
    this.isStatsModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  closeStatsModal() {
    this.isStatsModalOpen = false;
  }

  openDeleteModal(anime: Anime) {
    this.animeToDelete = anime;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.animeToDelete = null;
  }

  confirmDelete() {
    if (this.animeToDelete) {
      this.removeAnime(this.animeToDelete.id);
      this.closeDeleteModal();
    }
  }

  resetForm() {
    this.newAnime.name = '';
    this.selectedImage = null;
    this.newAnime.image = null;
    this.newAnime.rating = 0;
  }

  setRating(rating: number) {
    this.newAnime.rating = rating;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan büyük olamaz!');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin!');
        return;
      }

      this.newAnime.image = file;
      
      // Resim önizlemesi
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addAnime() {
    if (!this.newAnime.name.trim() || !this.newAnime.image) {
      alert('Lütfen anime adı ve resim ekleyin!');
      return;
    }

    // Yeni anime oluştur
    const newAnimeItem: Anime = {
      id: this.nextId++,
      name: this.newAnime.name.trim(),
      image: this.selectedImage!,
      addedDate: new Date(),
      rating: this.newAnime.rating
    };

    // Anime listesine ekle
    this.animeList.push(newAnimeItem);

    // Başarılı ekleme sonrası modal kapat
    this.closeModal();
    alert('Anime başarıyla eklendi!');
  }

  removeAnime(animeId: number) {
    this.animeList = this.animeList.filter(anime => anime.id !== animeId);
  }

  getAnimeCount() {
    return this.animeList.length;
  }

  trackByAnimeId(index: number, anime: Anime): number {
    return anime.id;
  }
}
