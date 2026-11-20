// Vista: catálogo. Obtiene los productos del JSON, los renderiza y aplica filtros y orden.
import { obtenerCatalogo } from "../datos/api.js";
import { filtrarProductos } from "../filtros.js";
import { crearElemento } from "../utilidades.js";
import { crearTarjeta } from "./tarjeta.js";
import { mostrarError } from "./aviso.js";

const CLAVE_FILTROS = "molido-filtros";

function leerFiltros(form) {
    const datos = new FormData(form);
    const categorias = new Set(datos.getAll("categoria"));
    // El select superior de categoría también filtra.
    const catSelect = datos.get("categoria_busqueda");
    if (catSelect) categorias.add(catSelect);

    return {
        texto: datos.get("buscar") ?? "",
        categorias,
        origenes: new Set(datos.getAll("origen")),
        precioMax: Number(datos.get("precio")),
        orden: datos.get("orden") ?? "relevancia",
    };
}

// Persistencia de los filtros elegidos (localStorage), para conservarlos al volver al catálogo.
function guardarFiltros(form) {
    try {
        const valores = [...new FormData(form)];
        localStorage.setItem(CLAVE_FILTROS, JSON.stringify(valores));
    } catch {
        /* Si localStorage no está disponible, simplemente no se recuerdan. */
    }
}

function restaurarFiltros(form) {
    try {
        const valores = JSON.parse(localStorage.getItem(CLAVE_FILTROS));
        if (!Array.isArray(valores)) return;
        for (const [nombre, valor] of valores) {
            const campos = form.querySelectorAll(`[name="${nombre}"]`);
            campos.forEach((campo) => {
                if (campo.type === "checkbox" || campo.type === "radio") {
                    if (campo.value === valor) campo.checked = true;
                } else {
                    campo.value = valor;
                }
            });
        }
    } catch {
        localStorage.removeItem(CLAVE_FILTROS);
    }
}

function renderizar(contenedor, lista, secciones) {
    contenedor.replaceChildren();

    if (lista.length === 0) {
        contenedor.append(crearElemento("p", "catalogo__vacio", "No encontramos productos con esos filtros."));
        return;
    }

    for (const { id, titulo } of secciones) {
        const deLaSeccion = lista.filter((p) => p.seccion === id);
        if (deLaSeccion.length === 0) continue;

        const seccion = crearElemento("section", "seccion categoria");
        const grilla = crearElemento("div", "grilla");
        grilla.append(...deLaSeccion.map(crearTarjeta));
        seccion.append(crearElemento("h2", "seccion__titulo", titulo), grilla);
        contenedor.append(seccion);
    }
}

export async function iniciarCatalogo() {
    const form = document.querySelector(".buscador__form");
    const contenedor = document.querySelector("#catalogo");
    const salidaPrecio = document.querySelector("#precio-valor");

    contenedor.replaceChildren(crearElemento("p", "catalogo__cargando", "Cargando productos..."));

    let catalogo;
    try {
        catalogo = await obtenerCatalogo();
    } catch (error) {
        mostrarError(contenedor, error.message);
        return;
    }

    const actualizar = () => {
        const filtros = leerFiltros(form);
        if (salidaPrecio) salidaPrecio.textContent = "Hasta $" + filtros.precioMax.toLocaleString("es-AR");
        renderizar(contenedor, filtrarProductos(catalogo.productos, filtros), catalogo.secciones);
        guardarFiltros(form);
    };

    form.addEventListener("input", actualizar);
    form.addEventListener("submit", (e) => e.preventDefault());
    form.addEventListener("reset", () => setTimeout(actualizar));

    restaurarFiltros(form);
    actualizar();
}
