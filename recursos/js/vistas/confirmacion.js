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

    contenedor.replaceChildren(
        crearElemento("h2", "confirmacion__titulo", `¡Gracias, ${pedido.cliente.nombre}!`),
        crearElemento("p", "", `Tu pedido ${pedido.numero} fue registrado.`),
        crearElemento("p", "confirmacion__aviso", `Recibimos tu pedido y te contactaremos a ${pedido.cliente.email} para coordinar la entrega.`),
        lista,
        crearElemento("p", "confirmacion__total", `Total: ${formatearPrecio(pedido.total)}`)
    );

    mostrarAviso(`Pedido ${pedido.numero} registrado. ¡Gracias por tu compra!`, "exito");
}
