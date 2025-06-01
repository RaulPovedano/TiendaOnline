import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { firstValueFrom } from 'rxjs';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Finalizar Compra</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Formulario de datos de envío -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Datos de Envío</h3>
          <form #checkoutForm="ngForm">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Nombre completo</label>
              <input type="text" 
                     [(ngModel)]="shippingData.fullName" 
                     name="fullName"
                     required
                     class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Dirección</label>
              <input type="text" 
                     [(ngModel)]="shippingData.address" 
                     name="address"
                     required
                     class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Ciudad</label>
              <input type="text" 
                     [(ngModel)]="shippingData.city" 
                     name="city"
                     required
                     class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Código Postal</label>
              <input type="text" 
                     [(ngModel)]="shippingData.postalCode" 
                     name="postalCode"
                     required
                     class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Teléfono</label>
              <input type="tel" 
                     [(ngModel)]="shippingData.phone" 
                     name="phone"
                     required
                     class="w-full px-3 py-2 border rounded-lg">
            </div>
          </form>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Resumen del Pedido</h3>
          
          <div *ngIf="cart$ | async as cart">
            <div *ngFor="let item of cart.items" class="flex justify-between py-2 border-b">
              <div class="flex items-center">
                <img [src]="getProductImage(item)" 
                     [alt]="getProductName(item)"
                     class="w-16 h-16 object-cover rounded">
                <div class="ml-4">
                  <p class="font-semibold">{{getProductName(item)}}</p>
                  <p class="text-sm text-gray-600">Cantidad: {{item.quantity}}</p>
                </div>
              </div>
              <span class="font-medium">
                {{getProductPrice(item) * item.quantity | number:'1.2-2'}}€
              </span>
            </div>

            <div class="mt-4 text-xl font-bold flex justify-between border-t pt-4">
              <span>Total:</span>
              <span>{{getTotal(cart) | number:'1.2-2'}}€</span>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="font-semibold mb-3">Método de Pago</h4>
            <div class="space-y-2">
              <label class="block">
                <input type="radio" 
                       [(ngModel)]="paymentMethod" 
                       name="paymentMethod" 
                       value="credit_card"
                       (change)="onPaymentMethodChange()"
                       class="mr-2">
                Tarjeta de Crédito
              </label>
            </div>
          </div>

          <div *ngIf="paymentMethod === 'credit_card'" class="mt-4">
            <div id="card-element" class="w-full px-3 py-2 border rounded-lg"></div>
            <div id="card-errors" class="text-red-500 mt-2" role="alert"></div>
          </div>

          <button (click)="processOrder()"
                  [disabled]="!isFormValid() || isProcessing"
                  class="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg 
                         hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isProcessing ? 'Procesando...' : 'Confirmar Pedido' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart$: Observable<Cart | null>;
  paymentMethod: string = '';
  isProcessing = false;
  shippingData = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  };
  errorMessage: string | null = null;

  constructor(
    public cartService: CartService,
    private router: Router,
    private stripeService: StripeService
  ) {
    this.cart$ = this.cartService.cart$;
  }

  async ngOnInit() {
  }

  async onPaymentMethodChange() {
    if (this.paymentMethod === 'credit_card') {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const cardElement = document.getElementById('card-element');
        if (!cardElement) {
          throw new Error('No se encontró el elemento para la tarjeta');
        }

        await this.stripeService.initializeCardElement('card-element');
      } catch (error) {
        console.error('Error initializing card:', error);
        this.errorMessage = 'Error al inicializar el formulario de pago';
      }
    }
  }

  ngOnDestroy() {
    if (this.paymentMethod === 'credit_card') {
      this.stripeService.cleanup();
    }
  }

  getProductImage(item: any): string {
    return item.productId?.img || '';
  }

  getProductName(item: any): string {
    return item.productId?.name || '';
  }

  getProductPrice(item: any): number {
    return item.productId?.price || 0;
  }

  getTotal(cart: any): number {
    if (!cart?.items) return 0;
    return cart.items.reduce((total: number, item: any) => {
      return total + (this.getProductPrice(item) * item.quantity);
    }, 0);
  }

  isFormValid(): boolean {
    return !!(
      this.shippingData.fullName &&
      this.shippingData.fullName.trim() !== '' &&
      this.shippingData.address &&
      this.shippingData.address.trim() !== '' &&
      this.shippingData.city &&
      this.shippingData.city.trim() !== '' &&
      this.shippingData.postalCode &&
      this.shippingData.postalCode.trim() !== '' &&
      this.shippingData.phone &&
      this.shippingData.phone.trim() !== '' &&
      this.paymentMethod === 'credit_card'
    );
  }

  async processOrder() {
    if (!this.isFormValid()) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    this.isProcessing = true;

    try {
      const cart = await firstValueFrom(this.cart$);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('No hay productos en el carrito');
      }

      const total = this.getTotal(cart);
      if (total <= 0) {
        throw new Error('El total del carrito debe ser mayor que 0');
      }

      const shippingData = {
        fullName: this.shippingData.fullName.trim(),
        address: this.shippingData.address.trim(),
        city: this.shippingData.city.trim(),
        postalCode: this.shippingData.postalCode.trim(),
        phone: this.shippingData.phone.trim()
      };

      const response = await firstValueFrom(
        this.cartService.checkout({
          shippingData,
          paymentMethod: 'credit_card'
        })
      );

      if (!response || !response.order || !response.order._id) {
        throw new Error('No se pudo crear la orden');
      }

      // Procesar el pago con Stripe
      const paymentResult = await this.stripeService.processPayment(total, response.order._id);
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Error al procesar el pago');
      }

      alert('¡Pedido realizado con éxito!');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al procesar el pedido: ' + errorMessage);
    } finally {
      this.isProcessing = false;
    }
  }
} 