// Funciones auxiliares reutilizables.
// Las funciones de cálculo son "puras" (no usan el DOM): por eso se pueden testear con Node.

export const COSTO_ENVIO = 3000;
export const ENVIO_GRATIS_DESDE = 50000;

export function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-AR");
}

export function calcularTotales(subtotal) {
    const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    return { subtotal, envio, total: subtotal + envio };
}

// Une el carrito ({ id, cantidad }) con los datos de los productos del catálogo.
// Los productos que ya no existen en el catálogo se descartan.
export function detallarItems(carrito, productos) {
    return carrito
        .map(({ id, cantidad }) => {
            const producto = productos.find((p) => p.id === id);
            return producto ? { producto, cantidad, subtotal: producto.precio * cantidad } : null;
        })
        .filter(Boolean);
}

export function sumarSubtotales(items) {
    return items.reduce((suma, i) => suma + i.subtotal, 0);
}

const MEDIOS_DE_PAGO = {
    efectivo: "Efectivo al recibir",
    transferencia: "Transferencia bancaria",
    tarjeta: "Tarjeta de crédito / débito",
};

// Arma el texto del pedido que se envía por email.
export function armarMensajePedido(pedido) {
    const { cliente } = pedido;
    const lineas = [
        `Nuevo pedido ${pedido.numero}`,
        "",
        ...pedido.items.map((i) => `- ${i.cantidad} x ${i.nombre}: ${formatearPrecio(i.subtotal)}`),
        "",
        `Subtotal: ${formatearPrecio(pedido.subtotal)}`,
        `Envío: ${pedido.envio === 0 ? "Gratis" : formatearPrecio(pedido.envio)}`,
        `Total: ${formatearPrecio(pedido.total)}`,
        "",
        `Cliente: ${cliente.nombre}`,
        `Teléfono: ${cliente.telefono}`,
        `Email: ${cliente.email}`,
        `Dirección: ${cliente.direccion}`,
        `Pago: ${MEDIOS_DE_PAGO[cliente.pago] ?? cliente.pago}`,
    ];
    if (cliente.notas && cliente.notas.trim()) lineas.push(`Indicaciones: ${cliente.notas.trim()}`);
    return lineas.join("\n");
}

export function normalizar(texto) {
    return String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Crea un elemento con clase y texto. Evita repetir createElement en cada vista.
export function crearElemento(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
}
