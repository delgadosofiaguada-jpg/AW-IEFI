# Molido Café — *El sabor de cada momento*

Sitio web front-end de **Molido Café**, cafetería de especialidad y pastelería artesanal (caso de negocio ficticio).
Proyecto final (IEFI) de **Aplicaciones Web 1** — Colegio Universitario IES Siglo 21.

- **Sitio publicado:** _(completar con la URL de Vercel)_
- **Alumna:** Delgado, Sofía — Analista de Sistemas y Desarrollo de Software
- **TP grupales (SP1 a SP4):** Astudillo, Delgado, Roldán, Gaido. Cada etapa está en su propia rama.

## Funcionalidades

- Catálogo renderizado desde un archivo **JSON** (`recursos/datos/productos.json`) obtenido con **`fetch`**, con manejo de errores (`try/catch`).
- **Filtros** por texto (sin tildes ni mayúsculas), categoría, origen y precio máximo, y orden por precio o nombre. Los filtros se recuerdan con `localStorage`.
- **Carrito** con alta, baja y modificación de cantidades, cálculo de envío y total, guardado en `localStorage`.
- **Proceso de compra en 3 pasos:** carrito → datos de entrega y pago → confirmación. El pedido se **envía por WhatsApp** (enlace `wa.me` con el detalle).
- **Formulario de contacto** que envía la consulta por **email real** con la API de Web3Forms.
- **Validaciones** HTML (`required`, `type`, `minlength`, `pattern`) y **JavaScript** (reglas propias con mensajes por campo).
- **Notificaciones** en la interfaz (avisos flotantes de éxito o error).
- Código organizado en **módulos ES** (`import` / `export`).

## Estructura

```
├── index.html, catalogo.html, carrito.html, pedido.html, confirmacion.html, contacto.html
├── recursos/
│   ├── datos/productos.json      Datos del catálogo (simula una API REST)
│   ├── estilos/estilos.css
│   ├── imagenes/
│   └── js/
│       ├── index.js              Punto de entrada: inicia la vista de cada página
│       ├── config.js             Número de WhatsApp y clave de Web3Forms
│       ├── almacen.js            Carrito y último pedido (localStorage)
│       ├── utilidades.js         Cálculos y funciones auxiliares
│       ├── filtros.js            Filtrado y orden del catálogo
│       ├── validacion.js         Reglas de validación de formularios
│       ├── datos/api.js          fetch del JSON con try/catch
│       ├── servicios/            whatsapp.js, email.js
│       └── vistas/               catalogo, tarjeta, carrito, resumen, pedido, confirmacion, contacto, aviso
├── tests/                        Tests con node:test
└── .github/workflows/ci-cd.yml   Pipeline de CI/CD
```

## Uso local

Los módulos ES no funcionan abriendo los archivos con `file://`: hace falta un servidor local.

```bash
npm install
npm run dev     # abre el sitio con Five Server
npm test        # ejecuta los tests unitarios (node --test)
```

## CI/CD

El workflow `.github/workflows/ci-cd.yml` de GitHub Actions:

1. **CI:** en cada push y pull request instala Node 22 y ejecuta `npm test` (tests unitarios y de integración con `node:test`).
2. **CD:** si el push es a `main` **y los tests pasaron**, despliega a producción en Vercel con Vercel CLI.

El despliegue automático propio de Vercel está desactivado (`vercel.json`), así **solo se publica código que pasó los tests**.
El workflow necesita los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` en *Settings → Secrets and variables → Actions*.
