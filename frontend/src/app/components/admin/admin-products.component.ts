import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Administrar Productos</h2>
        <div class="space-x-4">
          <button (click)="createNewProduct()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Añadir Producto
          </button>
          <button (click)="showCsvUpload = !showCsvUpload" 
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {{ showCsvUpload ? 'Cancelar' : 'Subir CSV' }}
          </button>
        </div>
      </div>

      <!-- Subir CSV -->
      <div *ngIf="showCsvUpload" class="bg-white p-4 rounded-lg shadow mb-6">
        <h3 class="text-lg font-bold mb-4">Subir Productos (CSV)</h3>
        <div class="space-y-4">
          <input type="file" (change)="onFileSelected($event)" 
                 accept=".csv"
                 class="w-full p-2 border rounded">
          <button (click)="uploadCSV()" 
                  [disabled]="!selectedFile"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300">
            Subir CSV
          </button>
          <p class="text-sm text-gray-600">
            El CSV debe tener las columnas: name,description,price,stock,img
          </p>
        </div>
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
                <button (click)="deleteProduct(product._id || '')" class="text-red-600 hover:text-red-900">Eliminar</button>
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
  selectedFile: File | null = null;
  showCsvUpload = false;
  private apiUrl = 'http://localhost:3000/api/admin/products';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user?.role !== 'ROLE_ADMIN') {
          this.router.navigate(['/']);
          return;
        }
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error verificando permisos:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => this.products = products,
      error: (error) => {
        console.error('Error cargando productos:', error);
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  createNewProduct() {
    this.editingProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      img: ''
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
        error: (error) => {
          console.error('Error actualizando producto:', error);
          if (error.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      // Crear nuevo producto
      this.http.post<Product>(this.apiUrl, this.editingProduct).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.editingProduct = null;
        },
        error: (error) => {
          console.error('Error creando producto:', error);
          if (error.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  deleteProduct(productId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== productId);
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
          if (error.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadCSV() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{message: string, count: number}>(`${this.apiUrl}/upload`, formData).subscribe({
      next: (response) => {
        console.log(response.message, response.count);
        this.loadProducts();
        this.selectedFile = null;
        this.showCsvUpload = false;
      },
      error: (error) => {
        console.error('Error subiendo CSV:', error);
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
} 