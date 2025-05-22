import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoices';

  constructor(private http: HttpClient) {}

  generateInvoice(order: Order, user: User) {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(16);
    doc.text('FACTURA', 20, 20);
    
    // Datos de la tienda
    doc.setFontSize(12);
    doc.text('Tienda Online', 20, 30);
    doc.text('Madrid', 20, 35);
    
    // Datos del cliente
    doc.text('Cliente:', 20, 45);
    doc.text(user.name, 20, 50);
    doc.text(user.email, 20, 55);
    
    // Datos de la factura
    doc.text('Factura nº: ' + order._id, 20, 65);
    doc.text('Fecha: ' + new Date(order.createdAt).toLocaleDateString(), 20, 70);
    
    // Tabla de productos
    const headers = [['Producto', 'Cantidad', 'Precio', 'Total']];
    const data = order.items.map(item => [
      item.productId.name,
      item.quantity.toString(),
      item.productId.price.toFixed(2) + '€',
      (item.quantity * item.productId.price).toFixed(2) + '€'
    ]);
    
    data.push(['', '', 'Total:', order.total.toFixed(2) + '€']);
    
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 80,
      theme: 'grid',
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 0,
      }
    });
    
    // Pie de página
    doc.setFontSize(10);
    doc.text('Gracias por comprar en nuestra tienda', 20, 200);
    
    // Guardar
    doc.save('factura.pdf');
  }

  downloadInvoice(orderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}`, {
      responseType: 'blob'
    });
  }
} 