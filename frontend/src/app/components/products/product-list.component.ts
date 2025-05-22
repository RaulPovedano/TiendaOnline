import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DecimalPipe } from '@angular/common';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ProductSearchComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Productos</h2>
        </div>
        
        <div class="mb-6">
          <app-product-search (search)="onSearch($event)"></app-product-search>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let product of products" 
               class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
            <div class="relative">
              <img [src]="product.img" [alt]="product.name" 
                   class="w-full h-56 object-cover">
              <div *ngIf="product.stock === 0" 
                   class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                Sin stock
              </div>
              <div *ngIf="product.stock > 0 && product.stock <= 5" 
                   class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded">
                Quedan pocas unidades
              </div>
            </div>
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="text-lg font-bold text-gray-800 mb-1">{{product.name}}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{product.description}}</p>
              <p class="text-xl font-bold text-blue-600 mb-4">{{product.price | number:'1.2-2'}}€</p>
              
              <div class="space-y-2 mt-auto">
                <button (click)="viewDetails(product)"
                        class="w-full bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200">
                  Ver Detalles
                </button>
                
                <button (click)="addToCart(product)"
                        class="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                        [disabled]="product.stock === 0">
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts()
      .subscribe({
        next: (products) => this.products = products,
        error: (error) => console.error('Error:', error)
      });
  }

  onSearch(term: string) {
    if (term.trim() === '') {
      this.loadProducts();
      return;
    }
    
    this.productService.searchProducts(term)
      .subscribe({
        next: (products) => this.products = products,
        error: (error) => console.error('Error:', error)
      });
  }

  viewDetails(product: Product) {
    this.router.navigate(['/products', product._id]);
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartService.addToCart(product)
      .subscribe({
        error: (error) => console.error('Error:', error)
      });
  }
} 