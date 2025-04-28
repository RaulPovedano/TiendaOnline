import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadCart();
  }

  private loadCart() {
    if (this.authService.isLoggedIn()) {
      this.http.get<Cart>(`${this.apiUrl}`).subscribe({
        next: (cart) => this.cartSubject.next(cart),
        error: () => this.cartSubject.next(null)
      });
    }
  }

  addToCart(product: Product): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.post<Cart>(`${this.apiUrl}/items`, {
      productId: product._id,
      quantity: 1
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        console.log('Producto añadido al carrito:', cart);
      }),
      catchError(error => {
        console.error('Error al añadir al carrito:', error);
        return throwError(() => error);
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.put<Cart>(`${this.apiUrl}/items/${productId}`, { quantity }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => {
        console.error('Error updating quantity:', error);
        return throwError(() => error);
      })
    );
  }

  removeFromCart(productId: string): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.delete<Cart>(`${this.apiUrl}/items/${productId}`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => {
        console.error('Error removing from cart:', error);
        return throwError(() => error);
      })
    );
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }
    
    return cart.items.reduce((total, item) => {
      if (item && typeof item.productId === 'object' && item.productId.price && item.quantity) {
        return total + (item.productId.price * item.quantity);
      }
      return total;
    }, 0);
  }

  isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }

  checkout(checkoutData: any): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.post<any>(`${this.apiUrl}/checkout`, checkoutData).pipe(
      tap(response => {
        this.cartSubject.next(response.cart);
        console.log('Checkout successful:', response);
      }),
      catchError(error => {
        console.error('Error during checkout:', error);
        return throwError(() => error);
      })
    );
  }
} 