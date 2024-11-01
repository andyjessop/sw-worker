var workers=(()=>{var s=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var a=Object.prototype.hasOwnProperty;var c=(r,e)=>{for(var t in e)s(r,t,{get:e[t],enumerable:!0})},d=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of p(e))!a.call(r,o)&&o!==t&&s(r,o,{get:()=>e[o],enumerable:!(n=l(e,o))||n.enumerable});return r};var i=r=>d(s({},"__esModule",{value:!0}),r);var x={};c(x,{default:()=>u});var f={async fetch(r,e,t){return new Response("Hello World!")}};var u={"worker-1":{fetch:f.fetch}};return i(x);})();
//# sourceMappingURL=service-worker.js.map

self.addEventListener('fetch', (event) => {
  console.log('Fetch event:', event.request.url);
  // Add your routing logic here
});
