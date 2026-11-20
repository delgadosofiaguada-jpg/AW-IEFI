// Tests unitarios de las reglas de validación de formularios.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { reglas, validarDatos } from "../recursos/js/validacion.js";

describe("reglas de validación", () => {
    test("nombre: exige nombre y apellido con letras", () => {
        assert.equal(reglas.nombre("Sofía Delgado"), "");
        assert.notEqual(reglas.nombre("Sofía"), "");
        assert.notEqual(reglas.nombre("Sofi4 D3lgado"), "");
    });

    test("email: valida el formato", () => {
        assert.equal(reglas.email("sofia@mail.com"), "");
        assert.notEqual(reglas.email("sofia@mail"), "");
        assert.notEqual(reglas.email(""), "");
    });

    test("teléfono: entre 8 y 13 dígitos", () => {
        assert.equal(reglas.telefono("351 123-4567"), "");
        assert.notEqual(reglas.telefono("1234"), "");
    });

    test("dirección: debe incluir la altura", () => {
        assert.equal(reglas.direccion("Av. Colón 1234"), "");
        assert.notEqual(reglas.direccion("Av. Colón"), "");
    });

    test("mensaje: al menos 20 caracteres", () => {
        assert.notEqual(reglas.mensaje("Hola"), "");
        assert.equal(reglas.mensaje("Quisiera saber los horarios del local."), "");
    });
});

describe("validarDatos", () => {
    const esquema = { nombre: "nombre", email: "email", pago: "seleccion" };

    test("datos correctos son válidos", () => {
        const r = validarDatos({ nombre: "Lucía Fernández", email: "lu@mail.com", pago: "efectivo" }, esquema);
        assert.deepEqual(r, { valido: true, errores: {} });
    });

    test("informa un error por cada campo inválido", () => {
        const r = validarDatos({ nombre: "Lu", email: "x", pago: "" }, esquema);
        assert.equal(r.valido, false);
        assert.deepEqual(Object.keys(r.errores), ["nombre", "email", "pago"]);
    });
});
