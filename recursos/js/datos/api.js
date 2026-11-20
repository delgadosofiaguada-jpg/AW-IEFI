// Acceso a los datos del catálogo. Simula una API REST leyendo un archivo JSON con fetch.

const URL_CATALOGO = "./recursos/datos/productos.json";

export async function obtenerCatalogo() {
    try {
        const respuesta = await fetch(URL_CATALOGO);
        if (!respuesta.ok) {
            throw new Error(`Respuesta HTTP ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        throw new Error("No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo.");
    }
}

export async function obtenerProductos() {
    const { productos } = await obtenerCatalogo();
    return productos;
}
