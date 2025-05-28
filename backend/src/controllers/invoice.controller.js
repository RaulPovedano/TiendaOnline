import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import PDFDocument from "pdfkit/js/pdfkit.js";

export const generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate('items.productId')
      .populate('userId');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verificar que el usuario tiene permiso para ver esta factura
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'ROLE_ADMIN') {
      return res.status(403).json({ message: "Not authorized to view this invoice" });
    }

    // Crear el PDF
    const doc = new PDFDocument();
    
    // Configurar la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${orderId}.pdf`);

    // Pipe el PDF a la respuesta
    doc.pipe(res);

    // Título
    doc.fontSize(20).text('FACTURA', { align: 'center' });
    doc.moveDown();

    // Datos de la tienda
    doc.fontSize(12).text('Tienda Online', { align: 'left' });
    doc.text('Madrid, España', { align: 'left' });
    doc.moveDown();

    // Datos del cliente
    doc.text(`Cliente: ${order.userId.name}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.moveDown();

    // Datos de la factura
    doc.text(`Factura nº: ${order._id}`);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Tabla de productos
    doc.text('Productos:', { underline: true });
    doc.moveDown();

    // Encabezados
    const headers = ['Producto', 'Cantidad', 'Precio', 'Total'];
    let y = doc.y;
    headers.forEach((header, i) => {
      doc.text(header, 50 + (i * 100), y);
    });
    doc.moveDown();

    // Productos
    order.items.forEach(item => {
      const product = item.productId;
      doc.text(product.name, 50, doc.y);
      doc.text(item.quantity.toString(), 150, doc.y);
      doc.text(`${product.price.toFixed(2)}€`, 250, doc.y);
      doc.text(`${(item.quantity * product.price).toFixed(2)}€`, 350, doc.y);
      doc.moveDown();
    });

    // Total
    doc.moveDown();
    doc.text(`Total: ${order.total.toFixed(2)}€`, { align: 'right' });

    // Pie de página
    doc.moveDown(2);
    doc.fontSize(10).text('Gracias por comprar en nuestra tienda', { align: 'center' });

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: "Error generating invoice" });
  }
}; 