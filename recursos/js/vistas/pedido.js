// Vista: datos de entrega y pago (paso 2 del proceso de compra).
// Valida el formulario, registra el pedido y lo envía por WhatsApp.
import { guardarPedido, leerCarrito, vaciarCarrito } from "../almacen.js";
import { obtenerProductos } from "../datos/api.js";
import { CONFIG } from "../config.js";
import { calcularTotales, crearElemento, detallarItems, formatearPrecio, sumarSubtotales } from "../utilidades.js";
import { conectarValidacion } from "../validacion.js";
import { armarMensajePedido, crearEnlaceWhatsApp } from "../servicios/whatsapp.js";
import { actualizarResumen } from "./resumen.js";
import { mostrarAviso, mostrarError } from "./aviso.js";

const ESQUEMA = {
    nombre: "nombre",
    email: "email",
    telefono: "telefono",
    direccion: "direccion",
    pago: "seleccion",
};

function renderizarProductos(lista, items) {
    lista.replaceChildren(
        ...items.map(({ producto, cantidad, subtotal }) =>
            crearElemento("li", "resumen__producto", `${cantidad} × ${producto.nombre} — ${formatearPrecio(subtotal)}`)
        )
    );
}

export async function iniciarPedido() {
    const listaResumen = document.querySelector("#resumen-productos");
    const form = document.querySelector("#form-pedido");

    let items;
    try {
        items = detallarItems(leerCarrito(), await obtenerProductos());
    } catch (error) {
        mostrarError(listaResumen, error.message);
        form.querySelector("[type='submit']").disabled = true;
        return;
    }

    // Sin productos no tiene sentido continuar: se vuelve al carrito.
    if (items.length === 0) {
        window.location.replace("./carrito.html");
        return;
    }

    renderizarProductos(listaResumen, items);
    actualizarResumen(sumarSubtotales(items));

    const validarFormulario = conectarValidacion(form, ESQUEMA);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = validarFormulario();
        if (!datos) {
            mostrarAviso("Revisá los campos marcados antes de continuar.", "error");
            return;
        }

        const pedido = {
            numero: "MC-" + Date.now().toString().slice(-6),
            fecha: new Date().toISOString(),
            cliente: datos,
            items: items.map(({ producto, cantidad, subtotal }) => ({
                id: producto.id,
                nombre: producto.nombre,
                cantidad,
                subtotal,
            })),
            ...calcularTotales(sumarSubtotales(items)),
        };
        pedido.enlaceWhatsApp = crearEnlaceWhatsApp(CONFIG.whatsapp, armarMensajePedido(pedido));

        guardarPedido(pedido);
        vaciarCarrito();

        // Se abre WhatsApp en otra pestaña (dentro del evento submit, así el navegador no lo bloquea)
        // y esta pestaña pasa a la confirmación.
        window.open(pedido.enlaceWhatsApp, "_blank", "noopener");
        window.location.href = "./confirmacion.html";
    });
}
