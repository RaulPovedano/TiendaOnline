import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from '../models/cart.model';

@Pipe({
  name: 'cartCount',
  standalone: true
})
export class CartCountPipe implements PipeTransform {
  transform(cart: Cart | null): number {
    return cart?.items?.length || 0;
  }
} 