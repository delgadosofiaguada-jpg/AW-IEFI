// Tests unitarios con el test runner nativo de Node (node:test).
// Se ejecutan con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularTotales, formatearPrecio, armarMensajePedido } from "../recursos/js/utilidades.js";
import { filtrarProductos } from "../recursos/js/filtros.js";

// 1. calcularTotales: envío de $3.000, gratis desde $50.000
test("calcularTotales suma el envío cuando el pedido es menor a $50.000", () => {
    assert.deepEqual(calcularTotales(10000), { subtotal: 10000, envio: 3000, total: 13000 });
});

test("calcularTotales no cobra envío desde $50.000", () => {
    assert.deepEqual(calcularTotales(50000), { subtotal: 50000, envio: 0, total: 50000 });
});

test("calcularTotales no cobra envío con el carrito vacío", () => {
    assert.equal(calcularTotales(0).total, 0);
});

// 2. formatearPrecio: formato de precios argentino
test("formatearPrecio agrega $ y el punto de miles", () => {
    assert.equal(formatearPrecio(9500), "$9.500");
});

// 3. filtrarProductos: búsqueda y filtro de precio del catálogo
const productos = [
    { nombre: "Café Origen", detalle: "Grano 250 g", precio: 9500 },
    { nombre: "Croissant", detalle: "Unidad", precio: 2500 },
];

test("filtrarProductos busca sin importar tildes ni mayúsculas", () => {
    const resultado = filtrarProductos(productos, { texto: "CAFE" });
    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].nombre, "Café Origen");
});

test("filtrarProductos respeta el precio máximo", () => {
    const resultado = filtrarProductos(productos, { precioMax: 5000 });
    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].nombre, "Croissant");
});

// 4. armarMensajePedido: texto del pedido que se envía por email
test("armarMensajePedido incluye el número, los productos y el total", () => {
    const texto = armarMensajePedido({
        numero: "MC-123456",
        items: [{ nombre: "Café Origen", cantidad: 2, subtotal: 19000 }],
        subtotal: 19000,
        envio: 3000,
        total: 22000,
        cliente: { nombre: "Lucía Fernández", telefono: "3511234567", email: "lu@mail.com", direccion: "Av. Colón 1234", pago: "efectivo" },
    });
    assert.ok(texto.includes("MC-123456"));
    assert.ok(texto.includes("2 x Café Origen"));
    assert.ok(texto.includes("Total: $22.000"));
});
