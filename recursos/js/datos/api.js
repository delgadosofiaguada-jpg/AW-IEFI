// Acceso a los datos del catálogo. Simula una API REST leyendo un archivo JSON con fetch.

// La ruta se resuelve respecto de este módulo, así funciona desde cualquier página.
const URL_CATALOGO = new URL("../../datos/productos.json", import.meta.url);

let catalogo = null; // Se guarda la primera respuesta para no repetir la petición.

export async function obtenerCatalogo() {
    if (catalogo) return catalogo;

    try {
        const respuesta = await fetch(URL_CATALOGO);
        if (!respuesta.ok) {
            throw new Error(`Respuesta HTTP ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        if (!Array.isArray(datos.productos) || !Array.isArray(datos.secciones)) {
            throw new Error("El JSON no tiene el formato esperado");
        }
        catalogo = datos;
        return catalogo;
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        throw new Error("No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo.");
    }
}

export async function obtenerProductos() {
    const { productos } = await obtenerCatalogo();
    return productos;
}
