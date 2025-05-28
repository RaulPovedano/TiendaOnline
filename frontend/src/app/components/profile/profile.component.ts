import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';
import { DecimalPipe } from '@angular/common';
import { User } from '../../models/user.model';
import { InvoiceService } from '../../services/invoice.service';

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
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Mi Perfil</h2>
              <button *ngIf="!isEditing" (click)="startEditing()"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Editar Perfil
              </button>
            </div>

            <!-- Vista de datos -->
            <div *ngIf="!isEditing" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <p class="mt-1 text-gray-900">{{ user?.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-gray-900">{{ user?.email }}</p>
              </div>
            </div>

            <!-- Formulario de edición -->
            <form *ngIf="isEditing" (ngSubmit)="updateProfile()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" [(ngModel)]="editUser.name" name="name"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" [(ngModel)]="editUser.email" name="email"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="flex justify-end space-x-4">
                <button type="button" (click)="cancelEdit()"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Guardar Cambios
                </button>
              </div>
            </form>
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

                <div class="mt-4 flex justify-end">
                  <button (click)="downloadInvoice(order)"
                          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <i class="fas fa-download"></i>
                    Descargar Factura
                  </button>
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
  editUser: User = {
    email: '',
    name: '',
    role: 'ROLE_USER'
  };
  orders: Order[] = [];
  isEditing: boolean = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadOrders();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.editUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      },
      error: (error) => {
        console.error('Error cargando datos del usuario:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (error: Error) => {
        console.error('Error cargando pedidos:', error);
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  updateProfile() {
    const updateData = {
      name: this.editUser.name,
      email: this.editUser.email
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editUser = {
          _id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        };
        this.isEditing = false;
        alert('Perfil actualizado correctamente');
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }

  cancelEdit() {
    if (this.user) {
      this.editUser = {
        _id: this.user._id,
        email: this.user.email,
        name: this.user.name,
        role: this.user.role
      };
    }
    this.isEditing = false;
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

  downloadInvoice(order: Order) {
    this.invoiceService.downloadInvoice(order._id || '').subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `factura-${order._id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: Error) => {
        console.error('Error descargando factura:', error);
      }
    });
  }
}