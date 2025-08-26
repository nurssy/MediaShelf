import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category, MediaItem } from '../services/category.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  isMenuOpen = false;
  isModalOpen = false;
  isStatsModalOpen = false;
  isDeleteModalOpen = false;
  selectedImage: string | null = null;
  newMediaItem: MediaItem = {
    name: '',
    image: null,
    rating: 0
  };
  
  currentCollection: Category | null = null;
  collections: Category[] = [];
  mediaItemToDelete: MediaItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
  
      this.categoryService.getCategories().subscribe({
        next: data => {
          this.collections = data;
          this.currentCollection = this.collections.find(c => c._id === categoryId) || null;
          if (!this.currentCollection) {
            this.router.navigate(['/user']);
          }
        },
        error: err => this.router.navigate(['/user'])
      });
    });
  }
  

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: data => this.collections = data,
      error: err => console.error(err)
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openAddMediaModal() {
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

  openDeleteModal(mediaItem: MediaItem) {
    this.mediaItemToDelete = mediaItem;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.mediaItemToDelete = null;
  }

  confirmDelete() {
    if (this.mediaItemToDelete && this.currentCollection?._id) {
      this.removeMediaItem(this.mediaItemToDelete._id!);
      this.closeDeleteModal();
    }
  }

  resetForm() {
    this.newMediaItem = {
      name: '',
      image: null,
      rating: 0
    };
    this.selectedImage = null;
  }

  setRating(rating: number) {
    this.newMediaItem.rating = rating;
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

      // Resim önizlemesi
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.newMediaItem.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addMediaItem() {
    if (!this.newMediaItem.name.trim() || !this.newMediaItem.image || !this.currentCollection?._id) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    this.categoryService.addMediaItem(this.currentCollection._id, this.newMediaItem).subscribe({
      next: (updatedCategory) => {
        // Update the current collection with new data
        this.currentCollection = updatedCategory;
        // Update the collections array
        const index = this.collections.findIndex(c => c._id === updatedCategory._id);
        if (index !== -1) {
          this.collections[index] = updatedCategory;
        }
        
        this.closeModal();
        alert(`${this.currentCollection.name} başarıyla eklendi!`);
      },
      error: err => {
        console.error(err);
        alert('İçerik eklenirken bir hata oluştu!');
      }
    });
  }

  removeMediaItem(itemId: string) {
    if (!this.currentCollection?._id) return;
    
    this.categoryService.deleteMediaItem(this.currentCollection._id, itemId).subscribe({
      next: (updatedCategory) => {
        // Update the current collection with new data
        this.currentCollection = updatedCategory;
        // Update the collections array
        const index = this.collections.findIndex(c => c._id === updatedCategory._id);
        if (index !== -1) {
          this.collections[index] = updatedCategory;
        }
      },
      error: err => {
        console.error(err);
        alert('İçerik silinirken bir hata oluştu!');
      }
    });
  }

  getMediaCount() {
    return this.currentCollection?.items.length || 0;
  }

  trackByMediaId(index: number, item: MediaItem): string {
    return item._id!;
  }

  navigateToCategory(collectionId: string) {
    this.router.navigate(['/category', collectionId]);
  }

  navigateToUser() {
    this.router.navigate(['/user']);
  }

  trackByCollectionId(index: number, collection: Category): string {
    return collection._id!;
  }

  getFavoritesCount(): number {
    return this.currentCollection?.items.filter(item => item.rating >= 4).length || 0;
  }

  getAverageRating(): number {
    const items = this.currentCollection?.items || [];
    if (items.length === 0) return 0;
    
    const totalRating = items.reduce((sum, item) => sum + item.rating, 0);
    return Math.round((totalRating / items.length) * 10) / 10;
  }
  goToUser(): void {
    this.router.navigate(['/user']);
  }
}
