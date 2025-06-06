import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  getTopCustomer(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-customer`);
  }

  getTopCustomersBySpent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-customers-spent`);
  }
}
