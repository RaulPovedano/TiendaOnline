import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  stripeForm: FormGroup;
  isProcessing: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private stripeService: StripeService
  ) {
    this.stripeForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit(): void {
  }

  async processPayment(): Promise<void> {
    if (!this.stripeForm.valid) {
      this.stripeForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      // 1. Crear la orden
      const order = await this.createOrder();
      if (!order) {
        throw new Error('No se pudo crear la orden');
      }

      // 2. Procesar el pago con Stripe
      const paymentResult = await this.stripeService.processPayment(
        this.cartTotal,
        order._id
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Error al procesar el pago');
      }

      // 3. Limpiar el carrito
      await this.cartService.clearCart();
      
      // 4. Redirigir a la página de éxito
      this.router.navigate(['/checkout/success'], {
        queryParams: { orderId: order._id }
      });
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Error al procesar el pedido';
      this.isProcessing = false;
    }
  }
} 