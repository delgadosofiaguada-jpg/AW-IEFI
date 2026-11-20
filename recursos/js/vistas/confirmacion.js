// Vista: confirmación del pedido (paso 3 del proceso de compra).
import { leerPedido } from "../almacen.js";
import { crearElemento, formatearPrecio } from "../utilidades.js";
import { mostrarAviso } from "./aviso.js";

export function iniciarConfirmacion() {
    const contenedor = document.querySelector("#confirmacion");
    const pedido = leerPedido();

    if (!pedido) {
        contenedor.replaceChildren(crearElemento("p", "", "No hay ningún pedido reciente para mostrar."));
        return;
    }

    const lista = crearElemento("ul", "confirmacion__lista");
    lista.append(
        ...pedido.items.map((i) =>
            crearElemento("li", "", `${i.cantidad} × ${i.nombre} — ${formatearPrecio(i.subtotal)}`)
        )
    );

    const whatsapp = crearElemento("a", "btn btn--whatsapp", "Enviar el pedido por WhatsApp");
    whatsapp.href = pedido.enlaceWhatsApp;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";

    contenedor.replaceChildren(
        crearElemento("h2", "confirmacion__titulo", `¡Gracias, ${pedido.cliente.nombre}!`),
        crearElemento("p", "", `Tu pedido ${pedido.numero} fue registrado.`),
        crearElemento(
            "p",
            "confirmacion__aviso",
            "Para confirmarlo, envianos el mensaje que se abrió en WhatsApp. Si no se abrió, usá el botón de abajo."
        ),
        lista,
        crearElemento("p", "confirmacion__total", `Total: ${formatearPrecio(pedido.total)}`),
        whatsapp
    );

    mostrarAviso(`Pedido ${pedido.numero} registrado. Te esperamos en WhatsApp para confirmarlo.`, "exito");
}
