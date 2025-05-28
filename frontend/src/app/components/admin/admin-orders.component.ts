import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/order.model';
import { DecimalPipe } from '@angular/common';
import { ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../services/admin.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ],
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.userId.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.total | number:'1.2-2' }}€</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select [(ngModel)]="order.status" 
                        (change)="updateOrderStatus(order)"
                        class="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="pending">Pendiente</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
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
            <p class="text-sm text-gray-600">Cliente: {{ selectedOrder.userId.name }}</p>
            <p class="text-sm text-gray-600">Email: {{ selectedOrder.userId.email }}</p>
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
                    <td class="px-4 py-2 text-sm">{{ item.productId.name }}</td>
                    <td class="px-4 py-2 text-sm">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-sm">{{ item.productId.price | number:'1.2-2' }}€</td>
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

      <div *ngIf="barChartData.labels.length" class="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800">Top 5 Clientes por Gasto</h3>
        </div>

        <div class="relative h-80 mb-8">
          <canvas baseChart
            [data]="barChartData"
            [type]="barChartType"
            [options]="chartOptions">
          </canvas>
        </div>

        <div class="space-y-2">
          <div *ngFor="let customer of topCustomers">
            <p class="text-sm">
              {{ customer.user?.email }} - {{ customer.totalSpent | number:'1.2-2' }}€
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [DecimalPipe]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  private apiUrl = 'http://localhost:3000/api/admin/orders';
  topCustomer: any = null;
  barChartData: any = {
    labels: [],
    datasets: []
  };
  barChartType: ChartType = 'bar';
  topCustomers: any[] = [];

  estadoMap: any = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            return typeof tickValue === 'number' ? tickValue + '€' : tickValue;
          }
        }
      }
    }
  };

  constructor(private http: HttpClient, private adminService: AdminService, private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.loadOrders();
    this.loadTopCustomersBySpent();
  }

  loadOrders() {
    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (orders) => this.orders = orders,
      error: (error) => console.error('Error cargando pedidos:', error)
    });
  }

  loadTopCustomersBySpent() {
    const barColors = [
      '#FF6384', // rojo
      '#36A2EB', // azul
      '#FFCE56', // amarillo
      '#4BC0C0', // verde agua
      '#9966FF'  // morado
    ];

    this.adminService.getTopCustomersBySpent().subscribe(data => {
      this.topCustomers = data;
      this.barChartData = {
        labels: data.map(d => d.user?.name || 'Desconocido'),
        datasets: [
          {
            data: data.map(d => d.totalSpent),
            label: 'Total gastado (€)',
            backgroundColor: barColors.slice(0, data.length)
          }
        ]
      };
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