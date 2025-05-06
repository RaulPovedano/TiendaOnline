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
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestros Productos</h2>
          <p class="text-gray-600 text-lg">Descubre nuestra selección de productos exclusivos</p>
        </div>
        
        <div class="mb-6">
          <app-product-search (search)="onSearch($event)"></app-product-search>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let product of products" 
               class="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="relative">
              <div class="aspect-w-16 aspect-h-9 overflow-hidden">
                <img [src]="product.img" [alt]="product.name" 
                     class="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110">
              </div>
              <div class="absolute top-2 right-2 flex flex-col gap-1">
                <span *ngIf="product.stock === 0" 
                      class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Sin stock
                </span>
                <span *ngIf="product.stock > 0 && product.stock <= 5" 
                      class="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Quedan pocas unidades
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{{product.name}}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{product.description}}</p>
              <div class="flex items-center justify-between mb-4">
                <p class="text-xl font-bold text-blue-600">{{product.price | number:'1.2-2'}}€</p>
                <span *ngIf="product.stock > 5" 
                      class="text-green-500 text-xs font-medium">
                  <i class="fas fa-check-circle mr-1"></i> En stock
                </span>
              </div>
              
              <div class="space-y-2">
                <button (click)="viewDetails(product)"
                        class="w-full bg-gray-100 text-gray-800 px-3 py-2 rounded-lg 
                               hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 text-sm">
                  <i class="fas fa-eye"></i>
                  Ver Detalles
                </button>
                
                <button (click)="addToCart(product)"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg 
                               hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-2 text-sm"
                        [disabled]="product.stock === 0">
                  <i class="fas fa-shopping-cart"></i>
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="successMessage" 
           class="fixed bottom-4 right-4 bg-green-100 border border-green-400 
                  text-green-700 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 flex items-center gap-2">
        <i class="fas fa-check-circle"></i>
        {{successMessage}}
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  successMessage: string = '';

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
        error: (error) => console.error('Error cargando productos:', error)
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
        error: (error) => console.error('Error buscando productos:', error)
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
        next: () => {
          this.successMessage = `${product.name} añadido al carrito`;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error al añadir al carrito:', error);
        }
      });
  }
} 