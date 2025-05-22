import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 class="text-9xl font-bold text-indigo-600">404</h1>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Página no encontrada</h2>
          <p class="mt-2 text-sm text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        <div class="mt-8">
          <a
            routerLink="/"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `
})
export class ErrorPageComponent {} 