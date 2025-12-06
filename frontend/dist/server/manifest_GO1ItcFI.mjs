import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CNF3N4Mv.mjs';
import 'es-module-lexer';
import { h as decodeKey } from './chunks/astro/server_VpJftL98.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/","adapterName":"@astrojs/node","routes":[{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"obtener-cotizacion/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/obtener-cotizacion","isIndex":false,"type":"page","pattern":"^\\/obtener-cotizacion\\/?$","segments":[[{"content":"obtener-cotizacion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/obtener-cotizacion.astro","pathname":"/obtener-cotizacion","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"reservas/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/reservas","isIndex":false,"type":"page","pattern":"^\\/reservas\\/?$","segments":[[{"content":"reservas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/reservas.astro","pathname":"/reservas","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"salones/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/salones","isIndex":false,"type":"page","pattern":"^\\/salones\\/?$","segments":[[{"content":"salones","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/salones.astro","pathname":"/salones","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DkRQhdin.js"}],"styles":[{"type":"external","src":"/_astro/contacto.DjbAlJyb.css"},{"type":"external","src":"/_astro/eventos.C0dRQe5x.css"}],"routeData":{"route":"/eventos","isIndex":false,"type":"page","pattern":"^\\/eventos\\/?$","segments":[[{"content":"eventos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/eventos.astro","pathname":"/eventos","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/contacto.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/eventos.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/obtener-cotizacion.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/reservas.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/salones.astro",{"propagation":"none","containsHead":true}],["C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/salones/[slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/eventos@_@astro":"pages/eventos.astro.mjs","\u0000@astro-page:src/pages/obtener-cotizacion@_@astro":"pages/obtener-cotizacion.astro.mjs","\u0000@astro-page:src/pages/reservas@_@astro":"pages/reservas.astro.mjs","\u0000@astro-page:src/pages/salones/[slug]@_@astro":"pages/salones/_slug_.astro.mjs","\u0000@astro-page:src/pages/salones@_@astro":"pages/salones.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_GO1ItcFI.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.DkRQhdin.js","/astro/hoisted.js?q=1":"_astro/hoisted.3ygVcdlh.js","/astro/hoisted.js?q=2":"_astro/hoisted.CX7iUjQU.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/logo_corpmeta.C8OX8TXH.png","/_astro/empresarial.02G5Lnxl.jpg","/_astro/terraza.C75resU0.jpg","/_astro/bar.CTVT5oWx.jpg","/_astro/email.DtsyJ8Jl.png","/_astro/millanura.BbpMHCtF.jpg","/_astro/presidencial.B2VXJPTj.jpg","/_astro/telefono.RkvKHMew.png","/_astro/ubicacion.C_Qgd54Z.png","/_astro/horario.CkcXOaPZ.png","/_astro/kiosko.pcdOycul.jpg","/_astro/fondoclub.C9NBFriN.png","/_astro/_slug_.NMld4DKv.css","/_astro/contacto.DjbAlJyb.css","/_astro/contacto.CCjwqyHE.css","/_astro/eventos.C0dRQe5x.css","/_astro/index.DhcPKdQm.css","/_astro/obtener-cotizacion.Zcbxar_9.css","/_astro/reservas.Br1S7Qwg.css","/_astro/hoisted.3ygVcdlh.js","/_astro/hoisted.CX7iUjQU.js","/_astro/hoisted.DkRQhdin.js","/contacto/index.html","/obtener-cotizacion/index.html","/reservas/index.html","/salones/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"AUSn3p0LA9h1g3vRUkwDomFQYMZ0YPQ0TVnKv/fRhzw=","experimentalEnvGetSecretEnabled":false});

export { manifest };
