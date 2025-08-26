import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <-- BUNU EKLE

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  collections: Category[] = [];
  newCollection: Partial<Category> = { name: '' };
  collectionToDelete: Category | null = null;

  isMenuOpen = false;
  isCollectionModalOpen = false;
  isDeleteCollectionModalOpen = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.collections = data;
      },
      error: (err) => {
        console.error('Kategori listesi yüklenemedi', err);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openCollectionModal(): void {
    this.newCollection = { name: '' };
    this.isCollectionModalOpen = true;
  }

  closeCollectionModal(): void {
    this.isCollectionModalOpen = false;
  }

  addCollection(): void {
    if (!this.newCollection.name?.trim()) return;

    const newCat: Category = {
      name: this.newCollection.name.trim(),
      items: []
    };

    this.categoryService.createCategory(newCat).subscribe({
      next: () => {
        this.loadCategories();
        this.closeCollectionModal();
      },
      error: (err) => {
        console.error('Kategori eklenemedi', err);
      }
    });
  }

  openDeleteCollectionModal(collection: Category): void {
    this.collectionToDelete = collection;
    this.isDeleteCollectionModalOpen = true;
  }

  closeDeleteCollectionModal(): void {
    this.isDeleteCollectionModalOpen = false;
  }

  confirmDeleteCollection(): void {
    if (!this.collectionToDelete?._id) return;

    this.categoryService.deleteCategory(this.collectionToDelete._id).subscribe({
      next: () => {
        this.loadCategories();
        this.closeDeleteCollectionModal();
      },
      error: (err) => {
        console.error('Kategori silinemedi', err);
      }
    });
  }

  // ✅ Kategoriye tıklayınca yönlendirme
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/category', categoryId]);
  }

  trackByCollectionId(index: number, item: Category): string {
    return item._id || index.toString();
  }
  
  goToUser(): void {
    this.router.navigate(['/user']);
  }
  
}
