// Envío del pedido por WhatsApp mediante un enlace wa.me (funciones puras).
import { formatearPrecio } from "../utilidades.js";

const MEDIOS_DE_PAGO = {
    efectivo: "Efectivo al recibir",
    transferencia: "Transferencia bancaria",
    tarjeta: "Tarjeta de crédito / débito",
};

export function armarMensajePedido(pedido) {
    const { cliente } = pedido;
    const lineas = [
        `*Nuevo pedido ${pedido.numero} - Molido Café*`,
        "",
        ...pedido.items.map((i) => `• ${i.cantidad} x ${i.nombre} — ${formatearPrecio(i.subtotal)}`),
        "",
        `Subtotal: ${formatearPrecio(pedido.subtotal)}`,
        `Envío: ${pedido.envio === 0 ? "Gratis" : formatearPrecio(pedido.envio)}`,
        `*Total: ${formatearPrecio(pedido.total)}*`,
        "",
        `Cliente: ${cliente.nombre}`,
        `Teléfono: ${cliente.telefono}`,
        `Email: ${cliente.email}`,
        `Dirección: ${cliente.direccion}`,
        `Pago: ${MEDIOS_DE_PAGO[cliente.pago] ?? cliente.pago}`,
    ];
    if (cliente.notas?.trim()) lineas.push(`Indicaciones: ${cliente.notas.trim()}`);
    return lineas.join("\n");
}

export function crearEnlaceWhatsApp(numero, texto) {
    const soloDigitos = String(numero).replace(/\D/g, "");
    return `https://wa.me/${soloDigitos}?text=${encodeURIComponent(texto)}`;
}
