// Validaciones de formularios con JavaScript.
// Complementan las validaciones HTML (required, type, minlength, pattern) con reglas
// que el HTML no puede expresar. Las funciones de reglas son puras y se testean con Node.

const SOLO_LETRAS = /^[a-záéíóúüñ' ]+$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Cada regla devuelve un mensaje de error, o "" si el valor es válido.
export const reglas = {
    nombre(valor) {
        const v = valor.trim();
        if (!v) return "Ingresá tu nombre y apellido.";
        if (!SOLO_LETRAS.test(v)) return "Usá solo letras y espacios.";
        if (v.split(/\s+/).length < 2) return "Ingresá nombre y apellido.";
        return "";
    },
    email(valor) {
        const v = valor.trim();
        if (!v) return "Ingresá tu correo electrónico.";
        if (!EMAIL.test(v)) return "El correo no tiene un formato válido (ej.: nombre@mail.com).";
        return "";
    },
    telefono(valor) {
        const digitos = valor.replace(/\D/g, "");
        if (!digitos) return "Ingresá tu teléfono.";
        if (digitos.length < 8 || digitos.length > 13) return "El teléfono debe tener entre 8 y 13 números.";
        return "";
    },
    direccion(valor) {
        const v = valor.trim();
        if (v.length < 5) return "Ingresá la dirección de entrega.";
        if (!/\d/.test(v)) return "Incluí la altura de la calle (ej.: Av. Colón 1234).";
        return "";
    },
    seleccion(valor) {
        return valor ? "" : "Elegí una opción.";
    },
    mensaje(valor) {
        const v = valor.trim();
        if (v.length < 20) return `El mensaje debe tener al menos 20 caracteres (llevás ${v.length}).`;
        return "";
    },
};

/**
 * Valida un objeto de datos según un esquema { campo: nombreDeRegla }.
 * Devuelve { valido, errores } donde errores es { campo: mensaje }.
 */
export function validarDatos(datos, esquema) {
    const errores = {};
    for (const [campo, regla] of Object.entries(esquema)) {
        const mensaje = reglas[regla](String(datos[campo] ?? ""));
        if (mensaje) errores[campo] = mensaje;
    }
    return { valido: Object.keys(errores).length === 0, errores };
}

// ---------- Parte de interfaz (usa el DOM) ----------

function mensajeDeCampo(control) {
    let span = document.getElementById(`error-${control.id}`);
    if (!span) {
        span = document.createElement("span");
        span.id = `error-${control.id}`;
        span.className = "formulario__error";
        span.setAttribute("aria-live", "polite");
        control.insertAdjacentElement("afterend", span);
        control.setAttribute("aria-describedby", span.id);
    }
    return span;
}

function marcarCampo(control, mensaje) {
    mensajeDeCampo(control).textContent = mensaje;
    control.classList.toggle("formulario__control--invalido", Boolean(mensaje));
    control.setAttribute("aria-invalid", String(Boolean(mensaje)));
}

/**
 * Conecta la validación JS a un formulario. Valida cada campo al salir de él (blur)
 * y todo el formulario al enviarlo. Devuelve una función que valida y retorna los datos o null.
 */
export function conectarValidacion(form, esquema) {
    const validarCampo = (control) => {
        const regla = esquema[control.name];
        if (!regla) return;
        marcarCampo(control, reglas[regla](control.value));
    };

    form.addEventListener("focusout", (e) => validarCampo(e.target));
    form.addEventListener("input", (e) => {
        // Una vez marcado con error, se revalida mientras el usuario escribe.
        if (e.target.classList.contains("formulario__control--invalido")) validarCampo(e.target);
    });
    form.addEventListener("reset", () => {
        form.querySelectorAll(".formulario__control").forEach((c) => marcarCampo(c, ""));
    });

    return function validarFormulario() {
        const datos = Object.fromEntries(new FormData(form));
        const { valido, errores } = validarDatos(datos, esquema);
        for (const campo of Object.keys(esquema)) {
            const control = form.elements[campo];
            if (control) marcarCampo(control, errores[campo] ?? "");
        }
        if (!valido) {
            const primero = form.elements[Object.keys(errores)[0]];
            primero?.focus();
            return null;
        }
        return datos;
    };
}
