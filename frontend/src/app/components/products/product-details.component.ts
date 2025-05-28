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
            <div class="md:w-1/2 relative">
              <img [src]="product.img" [alt]="product.name" 
                   class="w-full h-96 object-cover">
              <div *ngIf="product.stock === 0" 
                   class="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg">
                Sin stock
              </div>
              <div *ngIf="product.stock > 0 && product.stock <= 5" 
                   class="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg">
                Quedan pocas unidades
              </div>
            </div>
            <div class="md:w-1/2 p-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-3">{{product.name}}</h1>
              <p class="text-gray-600 mb-4">{{product.description}}</p>
              <p class="text-3xl font-bold text-blue-600 mb-6">{{product.price | number:'1.2-2'}}€</p>
              
              <div class="space-y-3">
                <button (click)="addToCart()"
                        class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        [disabled]="product.stock === 0">
                  Añadir al carrito
                </button>
                
                <button (click)="goBack()"
                        class="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200">
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="!product" class="text-center py-16">
          <p class="text-gray-600">Cargando...</p>
        </div>
        
        <div *ngIf="error" class="mt-6 text-center">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  error = '';

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
        error: () => this.error = 'Error al cargar el producto'
      });
  }

  addToCart() {
    if (!this.product) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartService.addToCart(this.product)
      .subscribe({
        error: () => this.error = 'Error al añadir al carrito'
      });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
} 