import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { PaymentService } from '../../services/payment.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe],
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

        <!-- Resumen del pedido -->
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

          <!-- Método de pago -->
          <div class="mt-6">
            <h4 class="font-semibold mb-3">Método de Pago</h4>
            <div class="space-y-2">
              <label class="block">
                <input type="radio" 
                       [(ngModel)]="paymentMethod" 
                       name="paymentMethod" 
                       value="credit_card"
                       class="mr-2">
                Tarjeta de Crédito
              </label>
              <label class="block">
                <input type="radio" 
                       [(ngModel)]="paymentMethod" 
                       name="paymentMethod" 
                       value="paypal"
                       class="mr-2">
                PayPal
              </label>
              <label class="block">
                <input type="radio" 
                       [(ngModel)]="paymentMethod" 
                       name="paymentMethod" 
                       value="test_mode"
                       class="mr-2">
                Modo de Prueba
              </label>
            </div>
          </div>

          <!-- Campos específicos según método de pago -->
          <div class="mt-4" *ngIf="paymentMethod === 'credit_card'">
            <h4 class="font-semibold mb-3">Datos de la Tarjeta</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-gray-700 mb-1">Nombre en la Tarjeta</label>
                <input type="text" 
                       [(ngModel)]="paymentData.creditCard.name" 
                       name="cardName"
                       required
                       class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Número de Tarjeta</label>
                <input type="text" 
                       [(ngModel)]="paymentData.creditCard.number" 
                       name="cardNumber"
                       required
                       maxlength="16"
                       pattern="[0-9]*"
                       placeholder="1234 5678 9012 3456"
                       class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 mb-1">Fecha de Expiración</label>
                  <input type="text" 
                         [(ngModel)]="paymentData.creditCard.expiry" 
                         name="cardExpiry"
                         required
                         maxlength="5"
                         placeholder="MM/YY"
                         class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                  <label class="block text-gray-700 mb-1">CVV</label>
                  <input type="text" 
                         [(ngModel)]="paymentData.creditCard.cvv" 
                         name="cardCvv"
                         required
                         maxlength="4"
                         pattern="[0-9]*"
                         placeholder="123"
                         class="w-full px-3 py-2 border rounded-lg">
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4" *ngIf="paymentMethod === 'paypal'">
            <h4 class="font-semibold mb-3">Datos de PayPal</h4>
            <div>
              <label class="block text-gray-700 mb-1">Email de PayPal</label>
              <input type="email" 
                     [(ngModel)]="paymentData.paypal.email" 
                     name="paypalEmail"
                     class="w-full px-3 py-2 border rounded-lg">
            </div>
          </div>

          <button (click)="processOrder()"
                  [disabled]="!isFormValid()"
                  class="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg 
                         hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart | null>;
  paymentMethod: string = '';
  shippingData = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  };
  paymentData = {
    creditCard: {
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    },
    paypal: {
      email: ''
    }
  };
  private stripe: any;
  private elements: any;
  cardElement: any;

  constructor(
    public cartService: CartService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.cart$ = this.cartService.cart$;
    this.initializeStripe();
  }

  async initializeStripe() {
    this.stripe = await this.paymentService.initializeStripe();
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    }
  }

  ngOnInit() {}

  getProductName(item: any): string {
    return item.productId?.name || '';
  }

  getProductPrice(item: any): number {
    return item.productId?.price || 0;
  }

  getProductImage(item: any): string {
    return item.productId?.img || '';
  }

  getTotal(cart: any): number {
    if (!cart?.items) return 0;
    return cart.items.reduce((total: number, item: any) => {
      return total + (this.getProductPrice(item) * item.quantity);
    }, 0);
  }

  isFormValid(): boolean {
    const baseValidation = !!(
      this.shippingData.fullName &&
      this.shippingData.address &&
      this.shippingData.city &&
      this.shippingData.postalCode &&
      this.shippingData.phone &&
      this.paymentMethod
    );

    if (!baseValidation) return false;

    switch (this.paymentMethod) {
      case 'credit_card':
        return !!(
          this.paymentData.creditCard.name &&
          this.paymentData.creditCard.number &&
          this.paymentData.creditCard.number.length === 16 &&
          this.paymentData.creditCard.expiry &&
          this.validateExpiryDate(this.paymentData.creditCard.expiry) &&
          this.paymentData.creditCard.cvv &&
          this.paymentData.creditCard.cvv.length >= 3
        );
      case 'paypal':
        return !!this.paymentData.paypal.email;
      case 'test_mode':
        return true;
      default:
        return false;
    }
  }

  private validateExpiryDate(expiry: string): boolean {
    if (!expiry || expiry.length !== 5) return false;
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryMonth = parseInt(month);
    const expiryYear = parseInt(year);

    if (isNaN(expiryMonth) || isNaN(expiryYear)) return false;
    if (expiryMonth < 1 || expiryMonth > 12) return false;
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
  }

  async processOrder() {
    if (!this.isFormValid()) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {
      if (this.paymentMethod === 'credit_card') {
        const cart = await firstValueFrom(this.cart$);
        const total = this.getTotal(cart);

        // Crear PaymentIntent
        const { clientSecret } = await firstValueFrom(
          this.paymentService.createPaymentIntent(total, this.paymentMethod)
        );

        // Confirmar el pago con los datos de la tarjeta
        const result = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {
              number: this.paymentData.creditCard.number,
              exp_month: parseInt(this.paymentData.creditCard.expiry.split('/')[0]),
              exp_year: parseInt('20' + this.paymentData.creditCard.expiry.split('/')[1]),
              cvc: this.paymentData.creditCard.cvv
            },
            billing_details: {
              name: this.paymentData.creditCard.name
            }
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        if (result.paymentIntent.status === 'succeeded') {
          this.completeOrder();
        }
      } else {
        this.completeOrder();
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      // Manejo de errores mejorado
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al procesar el pago';
      alert('Error al procesar el pago: ' + errorMessage);
    }
  }

  private completeOrder() {
    this.cartService.checkout({
      shippingData: this.shippingData,
      paymentMethod: this.paymentMethod,
      paymentDetails: this.paymentMethod === 'credit_card' 
        ? { name: this.paymentData.creditCard.name }
        : this.paymentMethod === 'paypal'
          ? { email: this.paymentData.paypal.email }
          : {}
    }).subscribe({
      next: () => {
        alert('¡Pedido realizado con éxito!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al procesar el pedido:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Error desconocido al procesar el pedido';
        alert('Error al procesar el pedido: ' + errorMessage);
      }
    });
  }
} 