// Estado del carrito y del último pedido. Es el único módulo que usa localStorage.
// El carrito se guarda como una lista de { id, cantidad }; los datos de cada producto
// se toman del catálogo (JSON) en el momento de mostrarlos.

const CLAVE = "molido-carrito";
const CLAVE_PEDIDO = "molido-ultimo-pedido";

function leerJSON(clave, porDefecto) {
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
    } catch {
        return porDefecto;
    }
}

function leer() {
    const items = leerJSON(CLAVE, []);
    return Array.isArray(items) ? items : [];
}

function guardar(items) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error);
    }
    document.dispatchEvent(new CustomEvent("carrito:cambio"));
}

export function agregarAlCarrito(id) {
    const items = leer();
    const item = items.find((i) => i.id === id);
    if (item) item.cantidad += 1;
    else items.push({ id, cantidad: 1 });
    guardar(items);
}

export function cambiarCantidad(id, delta) {
    const items = leer();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.cantidad += delta;
    guardar(items.filter((i) => i.cantidad > 0));
}

export function eliminarDelCarrito(id) {
    guardar(leer().filter((i) => i.id !== id));
}

export function vaciarCarrito() {
    guardar([]);
}

export function leerCarrito() {
    return leer();
}

export function contarUnidades() {
    return leer().reduce((suma, i) => suma + i.cantidad, 0);
}

export function guardarPedido(pedido) {
    try {
        localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
    } catch (error) {
        console.error("No se pudo guardar el pedido:", error);
    }
}

export function leerPedido() {
    return leerJSON(CLAVE_PEDIDO, null);
}
