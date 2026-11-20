// Vista: contacto. Valida el formulario y envía la consulta por email (Web3Forms).
import { conectarValidacion } from "../validacion.js";
import { enviarConsulta } from "../servicios/email.js";
import { mostrarAviso } from "./aviso.js";

const ESQUEMA = {
    nombre: "nombre",
    email: "email",
    telefono: "telefono",
    asunto: "seleccion",
    mensaje: "mensaje",
};

export function iniciarContacto() {
    const form = document.querySelector(".formulario");
    const estado = document.querySelector("#estado-formulario");
    const boton = form.querySelector("[type='submit']");
    const validarFormulario = conectarValidacion(form, ESQUEMA);

    const mostrarEstado = (texto, tipo) => {
        estado.textContent = texto;
        estado.classList.toggle("formulario__estado--error", tipo === "error");
        estado.hidden = false;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = validarFormulario();
        if (!datos) {
            mostrarAviso("Revisá los campos marcados antes de enviar.", "error");
            return;
        }

        boton.disabled = true;
        boton.textContent = "Enviando...";
        estado.hidden = true;

        try {
            await enviarConsulta(datos);
            mostrarEstado(`Gracias, ${datos.nombre}. Recibimos tu consulta y te responderemos a ${datos.email}.`, "exito");
            mostrarAviso("¡Consulta enviada!", "exito");
            form.reset();
            estado.hidden = false; // el reset lo oculta; se vuelve a mostrar el mensaje de éxito
        } catch (error) {
            mostrarEstado(error.message, "error");
            mostrarAviso(error.message, "error");
        } finally {
            boton.disabled = false;
            boton.textContent = "Enviar consulta";
        }
    });

    form.addEventListener("reset", () => {
        estado.hidden = true;
    });
}
