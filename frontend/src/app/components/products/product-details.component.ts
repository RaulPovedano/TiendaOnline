import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div *ngIf="product" class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/2 relative group">
              <div class="aspect-w-1 aspect-h-1">
                <img [src]="product.img" [alt]="product.name" 
                     class="w-full h-96 object-cover transform transition-transform duration-500 group-hover:scale-105">
              </div>
              <div class="absolute top-2 right-2">
                <span *ngIf="product.stock === 0" 
                      class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Sin stock
                </span>
                <span *ngIf="product.stock > 0 && product.stock <= 5" 
                      class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Quedan pocas unidades
                </span>
                <span *ngIf="product.stock > 5" 
                      class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  En stock
                </span>
              </div>
            </div>
            <div class="md:w-1/2 p-6 md:p-8">
              <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-3">{{product.name}}</h1>
                <p class="text-gray-600 text-base leading-relaxed mb-6">{{product.description}}</p>
                <div class="flex items-center justify-between mb-6">
                  <p class="text-3xl font-bold text-blue-600">{{product.price | number:'1.2-2'}}€</p>
                  <div class="flex items-center gap-2">
                    <span *ngIf="product.stock > 5" 
                          class="text-green-500 text-base font-medium">
                      <i class="fas fa-check-circle mr-2"></i>Disponible
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3">
                <button (click)="addToCart()"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg 
                               hover:from-blue-700 hover:to-blue-800 transition-all text-base font-medium flex items-center justify-center gap-3"
                        [disabled]="isAddingToCart || product.stock === 0"
                        [class.opacity-50]="isAddingToCart || product.stock === 0">
                  <i class="fas fa-shopping-cart"></i>
                  <span *ngIf="!isAddingToCart">Añadir al carrito</span>
                  <span *ngIf="isAddingToCart">Añadiendo...</span>
                </button>
                
                <button (click)="goBack()"
                        class="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg 
                               hover:bg-gray-200 transition-colors text-base font-medium flex items-center justify-center gap-3">
                  <i class="fas fa-arrow-left"></i>
                  Volver a productos
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="!product" class="text-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 text-lg">Cargando producto...</p>
        </div>
        
        <div *ngIf="error" class="mt-6 text-center">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ error }}
          </div>
        </div>
        
        <div *ngIf="successMessage" 
             class="fixed bottom-4 right-4 bg-green-100 border border-green-400 
                    text-green-700 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 flex items-center gap-2">
          <i class="fas fa-check-circle"></i>
          {{successMessage}}
        </div>
      </div>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  error: string = '';
  successMessage: string = '';
  isAddingToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProduct(id)
      .subscribe({
        next: (product) => this.product = product,
        error: (error) => {
          console.error('Error cargando producto:', error);
          this.error = 'Error al cargar el producto';
        }
      });
  }

  addToCart() {
    if (!this.product || this.isAddingToCart) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isAddingToCart = true;
    this.cartService.addToCart(this.product)
      .subscribe({
        next: () => {
          this.successMessage = `${this.product?.name} añadido al carrito`;
          setTimeout(() => {
            this.successMessage = '';
            this.isAddingToCart = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error al añadir al carrito:', error);
          this.error = 'Error al añadir al carrito';
          this.isAddingToCart = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
} 