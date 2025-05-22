import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Sobre Nosotros</h1>
          
          <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Nuestra Historia</h2>
            <p class="text-gray-600 mb-6">
              Mi Tienda Online nació con la visión de ofrecer una experiencia de compra única y personalizada. 
              Desde nuestros inicios, nos hemos comprometido a proporcionar productos de alta calidad a precios competitivos, 
              junto con un servicio al cliente excepcional.
            </p>
            <p class="text-gray-600">
              Lo que comenzó como un pequeño proyecto familiar, hoy se ha convertido en una plataforma de referencia 
              en el comercio electrónico, gracias a la confianza y el apoyo de nuestros clientes.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">Nuestra Misión</h2>
              <p class="text-gray-600">
                Nuestra misión es simplificar la experiencia de compra online, ofreciendo un catálogo diverso de productos, 
                procesos de compra seguros y un servicio de atención al cliente que supere las expectativas.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">Nuestros Valores</h2>
              <ul class="list-disc list-inside text-gray-600 space-y-2">
                <li>Calidad en cada producto</li>
                <li>Transparencia en todas nuestras operaciones</li>
                <li>Compromiso con la satisfacción del cliente</li>
                <li>Innovación constante en nuestros servicios</li>
              </ul>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Nuestro Equipo</h2>
            <p class="text-gray-600 mb-6">
              Detrás de Mi Tienda Online hay un equipo apasionado y dedicado que trabaja incansablemente 
              para ofrecer la mejor experiencia de compra posible. Desde nuestro equipo de atención al cliente 
              hasta nuestros expertos en logística, todos compartimos el mismo compromiso con la excelencia.
            </p>
            <div class="flex justify-center">
              <div class="text-center">
                <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="fas fa-user text-6xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Raul Povedano Ruiz</h3>
                <p class="text-gray-600">Proyecto TFG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {} 