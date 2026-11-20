// Envío real de las consultas por email usando la API gratuita de Web3Forms.
import { CONFIG } from "../config.js";

const URL_API = "https://api.web3forms.com/submit";

const ASUNTOS = {
    general: "Consulta general",
    pedido: "Consulta sobre un pedido",
    productos: "Consulta sobre un producto",
    otro: "Otra consulta",
};

export async function enviarConsulta(datos) {
    if (!CONFIG.web3formsKey || CONFIG.web3formsKey.startsWith("COMPLETAR")) {
        throw new Error("El envío de emails todavía no está configurado.");
    }

    try {
        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                access_key: CONFIG.web3formsKey,
                subject: `Molido Café — ${ASUNTOS[datos.asunto] ?? "Consulta"}`,
                from_name: "Web Molido Café",
                name: datos.nombre,
                email: datos.email,
                telefono: datos.telefono,
                motivo: ASUNTOS[datos.asunto] ?? datos.asunto,
                message: datos.mensaje,
            }),
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.success) {
            throw new Error(resultado.message || `Respuesta HTTP ${respuesta.status}`);
        }
        return resultado;
    } catch (error) {
        console.error("Error al enviar la consulta:", error);
        throw new Error("No pudimos enviar tu consulta. Intentá de nuevo en unos minutos.");
    }
}
