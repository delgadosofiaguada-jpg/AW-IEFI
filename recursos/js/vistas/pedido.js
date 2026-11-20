// Vista: datos de entrega y pago (paso 2 del proceso de compra).
// Valida el formulario y envía el pedido por email.
import { guardarPedido, leerCarrito, vaciarCarrito } from "../almacen.js";
import { obtenerProductos } from "../datos/api.js";
import {
    armarMensajePedido,
    calcularTotales,
    crearElemento,
    detallarItems,
    formatearPrecio,
    sumarSubtotales,
} from "../utilidades.js";
import { conectarValidacion } from "../validacion.js";
import { enviarPedido } from "../servicios/email.js";
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

    const boton = form.querySelector("[type='submit']");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = validarFormulario();
        if (!datos) {
            mostrarAviso("Revisá los campos marcados antes de continuar.", "error");
            return;
        }

        const pedido = {
            numero: "MC-" + Date.now().toString().slice(-6),
            cliente: datos,
            items: items.map(({ producto, cantidad, subtotal }) => ({
                nombre: producto.nombre,
                cantidad,
                subtotal,
            })),
            ...calcularTotales(sumarSubtotales(items)),
        };

        boton.disabled = true;
        boton.textContent = "Enviando pedido...";

        try {
            await enviarPedido(pedido, armarMensajePedido(pedido));
            guardarPedido(pedido);
            vaciarCarrito();
            window.location.href = "./confirmacion.html";
        } catch (error) {
            // Si el envío falla, el carrito se conserva para poder reintentar.
            mostrarAviso(error.message, "error");
            boton.disabled = false;
            boton.textContent = "Realizar pedido";
        }
    });
}
