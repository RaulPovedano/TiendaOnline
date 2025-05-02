import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/order.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Administrar Pedidos</h2>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of orders">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order._id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.userId?.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.total | number:'1.2-2' }}€</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ estadoMap[order.status] }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="viewOrderDetails(order)" class="text-indigo-600 hover:text-indigo-900">Ver Detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal de detalles del pedido -->
      <div *ngIf="selectedOrder" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Detalles del Pedido</h3>
            <button (click)="selectedOrder = null" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600">ID del Pedido: {{ selectedOrder._id }}</p>
            <p class="text-sm text-gray-600">Cliente: {{ selectedOrder.userId?.name }}</p>
            <p class="text-sm text-gray-600">Email: {{ selectedOrder.userId?.email }}</p>
            <p class="text-sm text-gray-600">Fecha: {{ selectedOrder.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            <p class="text-sm text-gray-600">Estado: {{ estadoMap[selectedOrder.status] }}</p>
          </div>
          
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Productos:</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Cantidad</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Precio</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let item of selectedOrder.items">
                    <td class="px-4 py-2 text-sm">{{ item.productId?.name }}</td>
                    <td class="px-4 py-2 text-sm">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-sm">{{ item.productId?.price | number:'1.2-2' }}€</td>
                    <td class="px-4 py-2 text-sm">{{ item.price | number:'1.2-2' }}€</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 py-2 text-right font-semibold">Total:</td>
                    <td class="px-4 py-2 font-semibold">{{ selectedOrder.total | number:'1.2-2' }}€</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Dirección de envío:</h4>
            <p class="text-sm text-gray-600">Dirección: {{ selectedOrder.shippingData?.address }}</p>
            <p class="text-sm text-gray-600">Ciudad: {{ selectedOrder.shippingData?.city }}</p>
            <p class="text-sm text-gray-600">Código Postal: {{ selectedOrder.shippingData?.postalCode }}</p>
            <p class="text-sm text-gray-600">Teléfono: {{ selectedOrder.shippingData?.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  private apiUrl = 'http://localhost:3000/api/admin/orders';

  estadoMap: any = {
    pending: 'Pendiente',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (orders) => this.orders = orders,
      error: (error) => console.error('Error cargando pedidos:', error)
    });
  }

  updateOrderStatus(order: Order) {
    this.http.put<Order>(`${this.apiUrl}/${order._id}/status`, { status: order.status }).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error actualizando estado del pedido:', error);
        // Revertir el cambio en caso de error
        this.loadOrders();
      }
    });
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }
} 