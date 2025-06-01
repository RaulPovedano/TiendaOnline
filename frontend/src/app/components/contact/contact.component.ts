import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
                  <p class="text-gray-600">raulpovedano87&#64;gmail.com</p>
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
            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input type="text" [(ngModel)]="name" name="name" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nombre">
                </div>
                <div>
                  <input type="email" [(ngModel)]="email" name="email" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Email">
                </div>
              </div>
              
              <div>
                <input type="text" [(ngModel)]="subject" name="subject" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Asunto">
              </div>
              
              <div>
                <textarea [(ngModel)]="message" name="message" rows="4" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Mensaje"></textarea>
              </div>
              
              <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ successMessage }}</span>
              </div>
              
              <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ errorMessage }}</span>
              </div>
              
              <button type="submit" 
                      [disabled]="isSubmitting"
                      class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
  name = '';
  email = '';
  subject = '';
  message = '';
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (this.name && this.email && this.subject && this.message) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.contactService.sendContactEmail({
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message
      }).subscribe({
        next: () => {
          this.successMessage = 'Mensaje enviado correctamente';
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          this.isSubmitting = false;
          console.error('Error al enviar el mensaje:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, rellena todos los campos';
    }
  }
} 