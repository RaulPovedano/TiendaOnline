import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="search-container">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          placeholder="Buscar productos..."
          class="search-input pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div *ngIf="searchTerm" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button 
            (click)="clearSearch()"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .search-input {
      font-size: 1rem;
      color: #4B5563;
    }
    .search-input::placeholder {
      color: #9CA3AF;
    }
    .search-input:focus {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class ProductSearchComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.search.emit('');
  }
} 