import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product-details/:id',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'products',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'login',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'register',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'cart',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'checkout',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'profile',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'admin/users',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'admin/products',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'admin/orders',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'about',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: 'contact',
    renderMode: RenderMode.ClientOnly
  },
  {
    path: '**',
    renderMode: RenderMode.ClientOnly
  }
]; 