import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Nuestros Productos</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div *ngFor="let product of products" 
             class="border rounded-lg p-4 shadow-sm">
          <h3 class="text-xl font-semibold">{{product.name}}</h3>
          <img [src]="product.img" [alt]="product.name" 
               class="w-full h-40 object-cover rounded-lg mb-2">
          <p class="text-gray-600">{{product.description}}</p>
          <p class="text-lg font-bold mt-2">{{product.price | number:'1.2-2'}}€</p>
          <p class="text-sm text-gray-500">Stock: {{product.stock}}</p>
          <button (click)="addToCart(product)"
                  class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg 
                         hover:bg-blue-600 transition-colors"
                  [disabled]="isAddingToCart"
                  [class.opacity-50]="isAddingToCart">
            <span *ngIf="!isAddingToCart">Añadir al carrito</span>
            <span *ngIf="isAddingToCart">Añadiendo...</span>
          </button>
        </div>
      </div>
      
      <div *ngIf="successMessage" 
           class="fixed bottom-4 right-4 bg-green-100 border border-green-400 
                  text-green-700 px-4 py-3 rounded shadow-lg">
        {{successMessage}}
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  successMessage: string = '';
  isAddingToCart: boolean = false;

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

  addToCart(product: Product) {
    if (this.isAddingToCart) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isAddingToCart = true;
    this.cartService.addToCart(product)
      .subscribe({
        next: () => {
          this.successMessage = `${product.name} añadido al carrito`;
          setTimeout(() => {
            this.successMessage = '';
            this.isAddingToCart = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error al añadir al carrito:', error);
          this.isAddingToCart = false;
        }
      });
  }
} 