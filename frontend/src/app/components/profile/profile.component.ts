import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/order.model';
import { DecimalPipe } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Información del Usuario -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold mb-6">Mi Perfil</h2>
            <div class="space-y-4">
              <div *ngIf="!isEditing">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <p class="mt-1 text-gray-900">{{ user?.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-gray-900">{{ user?.email }}</p>
                </div>
                
                <div class="flex justify-center space-x-4 mt-6">
                  <button (click)="editProfile()" 
                          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Editar Perfil
                  </button>
                </div>
              </div>

              <!-- Formulario de Edición -->
              <div *ngIf="isEditing" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" [(ngModel)]="editedUser.name" 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" [(ngModel)]="editedUser.email" 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                
                <div class="flex justify-center space-x-4 mt-6">
                  <button (click)="saveProfile()" 
                          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Guardar Cambios
                  </button>
                  <button (click)="cancelEdit()"
                          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Cancelar
                  </button>
                </div>

                <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {{ error }}
                </div>
                <div *ngIf="successMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  {{ successMessage }}
                </div>
              </div>
            </div>
          </div>

          <!-- Historial de Pedidos (solo para usuarios normales) -->
          <div *ngIf="user?.role === 'ROLE_USER'" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold mb-6">Historial de Pedidos</h2>
            
            <div *ngIf="orders.length === 0" class="text-center text-gray-500 py-8">
              No tienes pedidos realizados
            </div>
            
            <div *ngIf="orders.length > 0" class="space-y-6">
              <div *ngFor="let order of orders" class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-sm text-gray-500">Pedido #{{order._id}}</p>
                    <p class="text-sm text-gray-500">{{order.createdAt | date:'dd/MM/yyyy HH:mm'}}</p>
                  </div>
                  <span [class]="getStatusClass(order.status)">
                    {{getStatusText(order.status)}}
                  </span>
                </div>
                
                <div class="space-y-2">
                  <div *ngFor="let item of order.items" class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                      <img [src]="item.productId.img" [alt]="item.productId.name" 
                           class="w-16 h-16 object-cover rounded">
                      <div>
                        <p class="font-medium">{{item.productId.name}}</p>
                        <p class="text-sm text-gray-500">Cantidad: {{item.quantity}}</p>
                      </div>
                    </div>
                    <p class="font-medium">{{item.price | number:'1.2-2'}}€</p>
                  </div>
                </div>
                
                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                  <p class="text-sm text-gray-500">Método de pago: {{order.paymentMethod}}</p>
                  <p class="text-lg font-bold">Total: {{order.total | number:'1.2-2'}}€</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Administración (solo para administradores) -->
          <div *ngIf="user?.role === 'ROLE_ADMIN'" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Panel de Administración</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a routerLink="/admin/users" 
                 class="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
                <h4 class="text-lg font-semibold">Usuarios</h4>
                <p class="text-sm mt-2">Gestionar usuarios</p>
              </a>
              <a routerLink="/admin/products" 
                 class="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
                <h4 class="text-lg font-semibold">Productos</h4>
                <p class="text-sm mt-2">Gestionar productos</p>
              </a>
              <a routerLink="/admin/orders" 
                 class="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
                <h4 class="text-lg font-semibold">Pedidos</h4>
                <p class="text-sm mt-2">Gestionar pedidos</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  isEditing = false;
  editedUser = {
    name: '',
    email: ''
  };
  error: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user?.role === 'ROLE_USER') {
        this.loadOrders();
      }
    });
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => console.error('Error cargando pedidos:', error)
    });
  }

  editProfile() {
    this.isEditing = true;
    this.editedUser = {
      name: this.user?.name || '',
      email: this.user?.email || ''
    };
    this.error = '';
    this.successMessage = '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.error = '';
    this.successMessage = '';
  }

  saveProfile() {
    if (!this.user?._id) return;

    this.authService.updateProfile(this.user._id, this.editedUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.successMessage = 'Perfil actualizado correctamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al actualizar el perfil';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800';
      case 'shipped':
        return 'px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-800';
      case 'delivered':
        return 'px-2 py-1 text-sm rounded-full bg-green-100 text-green-800';
      case 'cancelled':
        return 'px-2 py-1 text-sm rounded-full bg-red-100 text-red-800';
      default:
        return 'px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'En proceso';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }
}