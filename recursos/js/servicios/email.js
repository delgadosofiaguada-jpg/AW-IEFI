// Envío real de pedidos y consultas por email usando la API gratuita de Web3Forms.
import { CONFIG } from "../config.js";

const URL_API = "https://api.web3forms.com/submit";

const ASUNTOS = {
    general: "Consulta general",
    pedido: "Consulta sobre un pedido",
    productos: "Consulta sobre un producto",
    otro: "Otra consulta",
};

// Envía los datos a Web3Forms. Si algo falla, lanza un error con un mensaje para el usuario.
async function enviarEmail(datos) {
    if (!CONFIG.web3formsKey || CONFIG.web3formsKey.startsWith("COMPLETAR")) {
        throw new Error("El envío de emails todavía no está configurado.");
    }

    try {
        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ access_key: CONFIG.web3formsKey, from_name: "Web Molido Café", ...datos }),
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.success) {
            throw new Error(resultado.message || `Respuesta HTTP ${respuesta.status}`);
        }
        return resultado;
    } catch (error) {
        console.error("Error al enviar el email:", error);
        throw new Error("No pudimos enviar la información. Intentá de nuevo en unos minutos.");
    }
}

export function enviarConsulta(datos) {
    return enviarEmail({
        subject: `Molido Café — ${ASUNTOS[datos.asunto] ?? "Consulta"}`,
        name: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        motivo: ASUNTOS[datos.asunto] ?? datos.asunto,
        message: datos.mensaje,
    });
}

export function enviarPedido(pedido, texto) {
    return enviarEmail({
        subject: `Molido Café — Nuevo pedido ${pedido.numero}`,
        name: pedido.cliente.nombre,
        email: pedido.cliente.email,
        message: texto,
    });
}
