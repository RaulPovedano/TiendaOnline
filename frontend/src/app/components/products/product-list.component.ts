import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Nuestros Productos</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div *ngFor="let product of products" 
             class="border rounded-lg p-4 shadow-sm">
          <h3 class="text-xl font-semibold">{{product.name}}</h3>
          <p class="text-gray-600">{{product.description}}</p>
          <p class="text-lg font-bold mt-2">€{{product.price}}</p>
          <p class="text-sm text-gray-500">Stock: {{product.stock}}</p>
          <button (click)="addToCart(product)"
                  class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  [disabled]="product.stock === 0">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  addToCart(product: Product) {
    // Implementaremos esto cuando creemos el CartService
  }
} 