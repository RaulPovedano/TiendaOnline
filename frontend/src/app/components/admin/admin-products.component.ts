import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Administrar Productos</h2>
        <button (click)="createNewProduct()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Añadir Producto
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of products">
              <td class="px-6 py-4 whitespace-nowrap">
                <img [src]="product.img" [alt]="product.name" class="h-10 w-10 rounded-full object-cover">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ product.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.price | number:'1.2-2' }}€</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="editProduct(product)" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                <button (click)="deleteProduct(product._id)" class="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Formulario de edición/creación -->
      <div *ngIf="editingProduct" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">{{ editingProduct._id ? 'Editar' : 'Crear' }} Producto</h3>
          <form (ngSubmit)="saveProduct()">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Nombre</label>
              <input type="text" [(ngModel)]="editingProduct.name" name="name" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Descripción</label>
              <textarea [(ngModel)]="editingProduct.description" name="description" required class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Precio</label>
              <input type="number" [(ngModel)]="editingProduct.price" name="price" required min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Stock</label>
              <input type="number" [(ngModel)]="editingProduct.stock" name="stock" required min="0" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">URL de la imagen</label>
              <input type="text" [(ngModel)]="editingProduct.img" name="img" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" (click)="cancelEdit()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Cancelar
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  editingProduct: Product | null = null;
  private apiUrl = 'http://localhost:3000/api/admin/products';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => this.products = products,
      error: (error) => console.error('Error cargando productos:', error)
    });
  }

  createNewProduct() {
    this.editingProduct = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      img: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  saveProduct() {
    if (!this.editingProduct) return;
    
    if (this.editingProduct._id) {
      // Actualizar producto existente
      this.http.put<Product>(`${this.apiUrl}/${this.editingProduct._id}`, this.editingProduct).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.editingProduct = null;
        },
        error: (error) => console.error('Error actualizando producto:', error)
      });
    } else {
      // Crear nuevo producto
      this.http.post<Product>(this.apiUrl, this.editingProduct).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.editingProduct = null;
        },
        error: (error) => console.error('Error creando producto:', error)
      });
    }
  }

  deleteProduct(productId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== productId);
        },
        error: (error) => console.error('Error eliminando producto:', error)
      });
    }
  }
} 