import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';
import { CartCountPipe } from './pipes/cart-count.pipe';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, CartCountPipe],
  templateUrl: './app.component.html'
})
export class AppComponent {
  isMobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router,
    private scrollService: ScrollService
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
