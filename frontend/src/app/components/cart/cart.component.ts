import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Carrito de Compras</h2>
      
      <ng-container *ngIf="cartService.cart$ | async as cart">
        <ng-container *ngIf="cart?.items && cart.items.length > 0; else emptyCart">
          <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div *ngFor="let item of cart.items" class="flex items-center justify-between border-b py-4">
              <div class="flex items-center">
                <img [src]="getProductImage(item)" 
                     [alt]="getProductName(item)"
                     class="w-24 h-24 object-cover rounded-lg shadow-sm">
                <div class="ml-4">
                  <h3 class="text-lg font-semibold">{{ getProductName(item) }}</h3>
                  <p class="text-gray-600 font-medium">
                    Precio: {{ getProductPrice(item) | number:'1.2-2' }}€
                  </p>
                  <p class="text-sm text-gray-500">
                    Subtotal: {{ (getProductPrice(item) * item.quantity) | number:'1.2-2' }}€
                  </p>
                </div>
              </div>
              
              <div class="flex items-center">
                <button (click)="updateQuantity(getProductId(item), item.quantity - 1)"
                        class="px-2 py-1 border rounded-l hover:bg-gray-100"
                        [disabled]="item.quantity <= 1">
                  -
                </button>
                <span class="px-4 py-1 border-t border-b">
                  {{item.quantity}}
                </span>
                <button (click)="updateQuantity(getProductId(item), item.quantity + 1)"
                        class="px-2 py-1 border rounded-r hover:bg-gray-100">
                  +
                </button>
                
                <button (click)="removeFromCart(getProductId(item))"
                        class="ml-4 text-red-500 hover:text-red-700">
                  <span class="sr-only">Eliminar</span>
                  ×
                </button>
              </div>
            </div>
            
            <div class="mt-6 flex justify-between items-center">
              <div class="text-lg font-semibold">
                Total: {{getTotal(cart) | number:'1.2-2'}}€
              </div>
              <button (click)="checkout()"
                      class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                Realizar Pedido
              </button>
            </div>
          </div>
        </ng-container>
        
        <ng-template #emptyCart>
          <div class="text-center py-8">
            <p class="text-gray-600">Tu carrito está vacío</p>
            <a routerLink="/" 
               class="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Continuar comprando
            </a>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `
})
export class CartComponent implements OnInit {
  constructor(public cartService: CartService, private router: Router) {}

  ngOnInit() {}

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    this.cartService.updateQuantity(productId, newQuantity).subscribe({
      error: (error) => console.error('Error al actualizar cantidad:', error)
    });
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe({
      error: (error) => console.error('Error al eliminar producto:', error)
    });
  }

  getTotal(cart: Cart): number {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = this.getProductPrice(item);
      return total + (price * (item?.quantity || 0));
    }, 0);
  }

  getProductId(item: CartItem): string {
    if (!item?.productId) return '';
    return typeof item.productId === 'string' ? item.productId : item.productId._id;
  }

  getProductName(item: CartItem): string {
    if (!item?.productId) return '';
    return typeof item.productId === 'string' ? '' : item.productId.name;
  }

  getProductPrice(item: CartItem): number {
    if (!item?.productId) return 0;
    return typeof item.productId === 'string' ? 0 : item.productId.price;
  }

  getProductImage(item: CartItem): string {
    if (!item?.productId) return '';
    return typeof item.productId === 'string' ? '' : (item.productId.img || '');
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
} 