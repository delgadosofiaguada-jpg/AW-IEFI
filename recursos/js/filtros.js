// Lógica de filtrado y orden del catálogo (función pura, sin DOM).
import { normalizar } from "./utilidades.js";

export const ordenadores = {
    relevancia: () => 0,
    precio_asc: (a, b) => a.precio - b.precio,
    precio_desc: (a, b) => b.precio - a.precio,
    nombre_asc: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    nombre_desc: (a, b) => b.nombre.localeCompare(a.nombre, "es"),
};

/**
 * @param {Array} productos
 * @param {{ texto?: string, categorias?: Set, origenes?: Set, precioMax?: number, orden?: string }} filtros
 */
export function filtrarProductos(productos, filtros = {}) {
    const texto = normalizar(filtros.texto ?? "").trim();
    const categorias = filtros.categorias ?? new Set();
    const origenes = filtros.origenes ?? new Set();
    const precioMax = Number.isFinite(filtros.precioMax) && filtros.precioMax > 0 ? filtros.precioMax : Infinity;
    const orden = ordenadores[filtros.orden] ?? ordenadores.relevancia;

    return productos
        .filter((p) => !texto || normalizar(p.nombre + " " + p.detalle).includes(texto))
        .filter((p) => categorias.size === 0 || categorias.has(p.categoria))
        .filter((p) => origenes.size === 0 || origenes.has(p.origen))
        .filter((p) => p.precio <= precioMax)
        .sort(orden);
}
