import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_kBzKx07t.mjs';
import { manifest } from './manifest_GO1ItcFI.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/contacto.astro.mjs');
const _page2 = () => import('./pages/eventos.astro.mjs');
const _page3 = () => import('./pages/obtener-cotizacion.astro.mjs');
const _page4 = () => import('./pages/reservas.astro.mjs');
const _page5 = () => import('./pages/salones/_slug_.astro.mjs');
const _page6 = () => import('./pages/salones.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/contacto.astro", _page1],
    ["src/pages/eventos.astro", _page2],
    ["src/pages/obtener-cotizacion.astro", _page3],
    ["src/pages/reservas.astro", _page4],
    ["src/pages/salones/[slug].astro", _page5],
    ["src/pages/salones.astro", _page6],
    ["src/pages/index.astro", _page7]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/dist/client/",
    "server": "file:///C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
