import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  constructor(private http: HttpClient) {
    this.stripe = loadStripe(environment.stripe.publicKey);
  }

  async initializeCardElement(containerId: string): Promise<void> {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new Error('Stripe no se pudo inicializar');
      }

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`No se encontró el elemento con ID ${containerId}`);
      }

      if (this.cardElement) {
        await this.cleanup();
      }

      this.elements = stripe.elements();
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      this.cardElement.mount(`#${containerId}`);

      this.cardElement.on('change', (event: any) => {
        const displayError = document.getElementById('card-errors');
        if (displayError) {
          displayError.textContent = event.error ? event.error.message : '';
        }
      });
    } catch (error) {
      console.error('Error al inicializar el elemento de tarjeta:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number, orderId: string): Promise<string> {
    try {
      const response = await this.http.post<{ clientSecret: string }>(
        `${environment.apiUrl}/payments/stripe/create-payment-intent`,
        { amount, paymentMethod: 'credit_card', orderId }
      ).toPromise();

      if (!response?.clientSecret) {
        throw new Error('No se recibió el clientSecret');
      }

      return response.clientSecret;
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error);
      throw error;
    }
  }

  async processPayment(amount: number, orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const stripe = await this.stripe;
      if (!stripe || !this.cardElement) {
        throw new Error('Stripe no está inicializado correctamente');
      }

      const clientSecret = await this.createPaymentIntent(amount, orderId);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            // Aquí puedes agregar detalles de facturación si los tienes
          }
        }
      });

      if (error) {
        console.error('Error en el pago:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (paymentIntent.status === 'succeeded') {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'El pago no se completó correctamente'
        };
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async cleanup(): Promise<void> {
    if (this.cardElement) {
      await this.cardElement.destroy();
      this.cardElement = null;
    }
    this.elements = null;
  }
} 