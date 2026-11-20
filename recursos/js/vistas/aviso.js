// Componente: notificación flotante (toast) para informar al usuario.
// tipo: "exito" | "error" | "info"

function obtenerContenedor() {
    let contenedor = document.querySelector(".avisos");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.className = "avisos";
        contenedor.setAttribute("role", "status");
        contenedor.setAttribute("aria-live", "polite");
        document.body.append(contenedor);
    }
    return contenedor;
}

export function mostrarAviso(texto, tipo = "info", duracion = 4500) {
    const aviso = document.createElement("p");
    aviso.className = `aviso aviso--${tipo}`;
    aviso.textContent = texto;
    obtenerContenedor().append(aviso);

    setTimeout(() => {
        aviso.classList.add("aviso--saliendo");
        aviso.addEventListener("animationend", () => aviso.remove(), { once: true });
    }, duracion);
}

// Mensaje fijo dentro de un contenedor (por ejemplo, cuando falla la carga del catálogo).
export function mostrarError(contenedor, texto) {
    const p = document.createElement("p");
    p.className = "mensaje-error";
    p.setAttribute("role", "alert");
    p.textContent = texto;
    contenedor.replaceChildren(p);
}
