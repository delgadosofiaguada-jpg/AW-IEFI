// Tests unitarios del armado del mensaje y del enlace de WhatsApp.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { armarMensajePedido, crearEnlaceWhatsApp } from "../recursos/js/servicios/whatsapp.js";

const pedido = {
    numero: "MC-123456",
    items: [{ nombre: "Café Origen", cantidad: 2, subtotal: 19000 }],
    subtotal: 19000,
    envio: 3000,
    total: 22000,
    cliente: {
        nombre: "Lucía Fernández",
        telefono: "3511234567",
        email: "lu@mail.com",
        direccion: "Av. Colón 1234",
        pago: "efectivo",
        notas: "",
    },
};

describe("WhatsApp", () => {
    test("el mensaje incluye número de pedido, productos y total", () => {
        const texto = armarMensajePedido(pedido);
        assert.match(texto, /MC-123456/);
        assert.match(texto, /2 x Café Origen/);
        assert.match(texto, /Total: \$22\.000/);
        assert.match(texto, /Efectivo al recibir/);
        assert.doesNotMatch(texto, /Indicaciones/);
    });

    test("el enlace usa wa.me, limpia el número y codifica el texto", () => {
        const url = crearEnlaceWhatsApp("+54 9 351 123-4567", "Hola & chau");
        assert.equal(url, "https://wa.me/5493511234567?text=Hola%20%26%20chau");
    });
});
