import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  }
  // Aquí añadiremos más rutas después
];
