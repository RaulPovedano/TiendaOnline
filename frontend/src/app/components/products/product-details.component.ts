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
    <div class="container mx-auto p-4">
      <div *ngIf="product" class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2">
            <img [src]="product.img" [alt]="product.name" 
                 class="w-full h-96 object-cover">
          </div>
          <div class="md:w-1/2 p-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{product.name}}</h1>
            <p class="text-gray-600 mb-4">{{product.description}}</p>
            <p class="text-2xl font-bold text-blue-600 mb-4">{{product.price | number:'1.2-2'}}€</p>
            <p class="text-sm text-gray-500 mb-6">Stock disponible: {{product.stock}}</p>
            
            <button (click)="addToCart()"
                    class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg 
                           hover:bg-blue-700 transition-colors mb-4"
                    [disabled]="isAddingToCart"
                    [class.opacity-50]="isAddingToCart">
              <span *ngIf="!isAddingToCart">Añadir al carrito</span>
              <span *ngIf="isAddingToCart">Añadiendo...</span>
            </button>
            
            <button (click)="goBack()"
                    class="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg 
                           hover:bg-gray-300 transition-colors">
              Volver a productos
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!product" class="text-center py-8">
        <p class="text-gray-600">Cargando producto...</p>
      </div>
      
      <div *ngIf="error" class="mt-4 text-center text-red-600">
        {{ error }}
      </div>
      
      <div *ngIf="successMessage" 
           class="fixed bottom-4 right-4 bg-green-100 border border-green-400 
                  text-green-700 px-4 py-3 rounded shadow-lg">
        {{successMessage}}
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