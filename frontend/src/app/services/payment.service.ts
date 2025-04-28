import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';
  private stripePromise = loadStripe(environment.stripePublicKey);

  constructor(private http: HttpClient) {}

  async initializeStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }

  createPaymentIntent(amount: number, paymentMethod: string) {
    return this.http.post<{clientSecret: string}>(`${this.apiUrl}/create-payment-intent`, {
      amount,
      paymentMethod
    });
  }
} 