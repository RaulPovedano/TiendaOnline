import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Administrar Usuarios</h2>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user._id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span [class]="user.role === 'ROLE_ADMIN' ? 'px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800' : 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'">
                  {{ user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                <button (click)="deleteUser(user._id)" class="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Formulario de edición -->
      <div *ngIf="editingUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Editar Usuario</h3>
          <form (ngSubmit)="saveUser()">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Nombre</label>
              <input type="text" [(ngModel)]="editingUser.name" name="name" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Email</label>
              <input type="email" [(ngModel)]="editingUser.email" name="email" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Rol</label>
              <select [(ngModel)]="editingUser.role" name="role" class="w-full px-3 py-2 border rounded-lg">
                <option value="ROLE_USER">Usuario</option>
                <option value="ROLE_ADMIN">Administrador</option>
              </select>
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
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  editingUser: User | null = null;
  private apiUrl = 'http://localhost:3000/api/admin/users';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  editUser(user: User) {
    this.editingUser = { ...user };
  }

  cancelEdit() {
    this.editingUser = null;
  }

  saveUser() {
    if (!this.editingUser || !this.editingUser._id) return;
    
    this.http.put<User>(`${this.apiUrl}/${this.editingUser._id}`, this.editingUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.editingUser = null;
      },
      error: (error) => console.error('Error actualizando usuario:', error)
    });
  }

  deleteUser(userId: string | undefined) {
    if (!userId) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.http.delete(`${this.apiUrl}/${userId}`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
        },
        error: (error) => console.error('Error eliminando usuario:', error)
      });
    }
  }
} 