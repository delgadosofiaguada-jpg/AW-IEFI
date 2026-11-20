// Tests de integración: filtros aplicados sobre los datos reales del archivo JSON.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { filtrarProductos } from "../recursos/js/filtros.js";

const { productos } = JSON.parse(
    await readFile(new URL("../recursos/datos/productos.json", import.meta.url), "utf8")
);

describe("productos.json", () => {
    test("cada producto tiene id único, nombre y precio numérico", () => {
        const ids = new Set(productos.map((p) => p.id));
        assert.equal(ids.size, productos.length);
        for (const p of productos) {
            assert.ok(p.nombre, `falta nombre en ${p.id}`);
            assert.equal(typeof p.precio, "number");
        }
    });
});

describe("filtrarProductos", () => {
    test("sin filtros devuelve todos los productos", () => {
        assert.equal(filtrarProductos(productos).length, productos.length);
    });

    test("la búsqueda ignora tildes y mayúsculas", () => {
        const resultado = filtrarProductos(productos, { texto: "CAFE ORIGEN" });
        assert.ok(resultado.some((p) => p.id === "cafe-origen"));
    });

    test("filtra por categoría", () => {
        const resultado = filtrarProductos(productos, { categorias: new Set(["granos"]) });
        assert.ok(resultado.length > 0);
        assert.ok(resultado.every((p) => p.categoria === "granos"));
    });

    test("respeta el precio máximo", () => {
        const resultado = filtrarProductos(productos, { precioMax: 5000 });
        assert.ok(resultado.every((p) => p.precio <= 5000));
    });

    test("ordena por precio ascendente", () => {
        const precios = filtrarProductos(productos, { orden: "precio_asc" }).map((p) => p.precio);
        assert.deepEqual(precios, [...precios].sort((a, b) => a - b));
    });

    test("no modifica el arreglo original", () => {
        const copia = structuredClone(productos);
        filtrarProductos(productos, { orden: "precio_desc" });
        assert.deepEqual(productos, copia);
    });
});
