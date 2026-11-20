// Tests unitarios de los cálculos del carrito (node:test, sin dependencias externas).
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
    calcularTotales,
    formatearPrecio,
    detallarItems,
    sumarSubtotales,
    normalizar,
    COSTO_ENVIO,
    ENVIO_GRATIS_DESDE,
} from "../recursos/js/utilidades.js";

describe("calcularTotales", () => {
    test("un carrito vacío no cobra envío", () => {
        assert.deepEqual(calcularTotales(0), { subtotal: 0, envio: 0, total: 0 });
    });

    test("debajo del mínimo se suma el costo de envío", () => {
        const { envio, total } = calcularTotales(10000);
        assert.equal(envio, COSTO_ENVIO);
        assert.equal(total, 10000 + COSTO_ENVIO);
    });

    test("desde el mínimo el envío es gratis", () => {
        assert.equal(calcularTotales(ENVIO_GRATIS_DESDE).envio, 0);
        assert.equal(calcularTotales(ENVIO_GRATIS_DESDE + 1).total, ENVIO_GRATIS_DESDE + 1);
    });
});

describe("formatearPrecio", () => {
    test("usa el signo $ y separador de miles argentino", () => {
        assert.equal(formatearPrecio(9500), "$9.500");
        assert.equal(formatearPrecio(125000), "$125.000");
    });
});

describe("detallarItems y sumarSubtotales", () => {
    const productos = [
        { id: "a", nombre: "Café", precio: 1000 },
        { id: "b", nombre: "Torta", precio: 2500 },
    ];

    test("une el carrito con los datos del catálogo y calcula subtotales", () => {
        const items = detallarItems([{ id: "a", cantidad: 3 }, { id: "b", cantidad: 1 }], productos);
        assert.equal(items.length, 2);
        assert.equal(items[0].subtotal, 3000);
        assert.equal(sumarSubtotales(items), 5500);
    });

    test("descarta productos que ya no existen en el catálogo", () => {
        const items = detallarItems([{ id: "x", cantidad: 1 }], productos);
        assert.deepEqual(items, []);
    });
});

describe("normalizar", () => {
    test("quita tildes y pasa a minúsculas", () => {
        assert.equal(normalizar("Café CÁPSULAS"), "cafe capsulas");
    });
});
