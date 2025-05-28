import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, orderId: string): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${environment.apiUrl}/payments/stripe/create-payment-intent`,
      { amount, orderId }
    );
  }

  createPaypalOrder(amount: number): Observable<{ orderId: string }> {
    return this.http.post<{ orderId: string }>(
      `${environment.apiUrl}/payments/paypal/create-order`,
      { amount }
    );
  }
} 