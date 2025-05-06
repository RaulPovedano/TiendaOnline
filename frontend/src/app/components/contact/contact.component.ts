import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Contacto</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">Información de Contacto</h2>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <i class="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                  <p class="text-gray-600">Calle Principal, 123<br>28001 Madrid, España</p>
                </div>
                <div class="flex items-center space-x-3">
                  <i class="fas fa-phone text-blue-600 text-xl"></i>
                  <p class="text-gray-600">+34 123 456 789</p>
                </div>
                <div class="flex items-center space-x-3">
                  <i class="fas fa-envelope text-blue-600 text-xl"></i>
                  <p class="text-gray-600">info&#64;mitiendaonline.com</p>
                </div>
                <div class="flex items-center space-x-3">
                  <i class="fas fa-clock text-blue-600 text-xl"></i>
                  <p class="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Síguenos</h2>
              <div class="flex justify-center space-x-8">
                <a href="https://www.facebook.com/profile.php?id=100094502201123" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <i class="fab fa-facebook-f text-4xl"></i>
                </a>
                <a href="https://www.instagram.com/__.raulpr__" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <i class="fab fa-instagram text-4xl"></i>
                </a>
                <a href="https://www.linkedin.com/in/raul-povedano-72b12023a" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <i class="fab fa-linkedin-in text-4xl"></i>
                </a>
                <a href="https://github.com/RaulPovedano" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">
                  <i class="fab fa-github text-4xl"></i>
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Formulario de Contacto</h2>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" id="name" formControlName="name" 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         [ngClass]="{'border-red-500': contactForm.get('name')?.invalid && contactForm.get('name')?.touched}">
                  <p class="text-red-500 text-sm mt-1" *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                    El nombre es requerido
                  </p>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" formControlName="email" 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         [ngClass]="{'border-red-500': contactForm.get('email')?.invalid && contactForm.get('email')?.touched}">
                  <p class="text-red-500 text-sm mt-1" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                    Por favor, introduce un email válido
                  </p>
                </div>
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <input type="text" id="subject" formControlName="subject" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       [ngClass]="{'border-red-500': contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched}">
                <p class="text-red-500 text-sm mt-1" *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                  El asunto es requerido
                </p>
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea id="message" formControlName="message" rows="4" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          [ngClass]="{'border-red-500': contactForm.get('message')?.invalid && contactForm.get('message')?.touched}"></textarea>
                <p class="text-red-500 text-sm mt-1" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                  El mensaje es requerido
                </p>
              </div>
              
              <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ successMessage }}</span>
              </div>
              
              <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ errorMessage }}</span>
              </div>
              
              <button type="submit" 
                      [disabled]="contactForm.invalid || isSubmitting"
                      class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      // Simular el envío del correo
      setTimeout(() => {
        this.successMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        this.contactForm.reset();
        this.isSubmitting = false;
      }, 1500);
    }
  }
} 