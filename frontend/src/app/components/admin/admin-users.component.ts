import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-2 sm:p-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 class="text-xl sm:text-2xl font-bold">Administrar Usuarios</h2>
        <button (click)="createNewUser()" 
                class="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto">
          Añadir Usuario
        </button>
      </div>

      <div class="sm:hidden space-y-4">
        <div *ngFor="let user of users" class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center gap-4 mb-3">
            <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-xl text-gray-600">{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ user.name }}</h3>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">{{ user.role }}</span>
            <div class="space-x-2">
              <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
              <button (click)="deleteUser(user._id || '')" class="text-red-600 hover:text-red-900">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of users">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-lg text-gray-600">{{ user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                  <button (click)="deleteUser(user._id || '')" class="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="editingUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 class="text-lg sm:text-xl font-bold mb-4">{{ editingUser._id ? 'Editar' : 'Crear' }} Usuario</h3>
          <form (ngSubmit)="saveUser()">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base">Nombre</label>
              <input type="text" [(ngModel)]="editingUser.name" name="name" required 
                     class="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base">Email</label>
              <input type="email" [(ngModel)]="editingUser.email" name="email" required 
                     class="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base">Contraseña</label>
              <input type="password" [(ngModel)]="editingUser.password" name="password" 
                     [required]="!editingUser._id"
                     class="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
              <p *ngIf="editingUser._id" class="text-xs text-gray-500 mt-1">
                Dejar en blanco para mantener la contraseña actual
              </p>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base">Rol</label>
              <select [(ngModel)]="editingUser.role" name="role" required 
                      class="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" (click)="cancelEdit()" 
                      class="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base">
                Cancelar
              </button>
              <button type="submit" 
                      class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
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
  private apiUrl = environment.apiUrl + '/admin/users';

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
    if (!this.editingUser) return;
    
    if (this.editingUser._id) {
      // Update existing user
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
    } else {
      this.http.post<User>(this.apiUrl, this.editingUser).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.editingUser = null;
        },
        error: (error) => console.error('Error creando usuario:', error)
      });
    }
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

  createNewUser() {
    this.editingUser = {
      name: '',
      email: '',
      password: '',
      role: 'ROLE_USER'
    };
  }
} 