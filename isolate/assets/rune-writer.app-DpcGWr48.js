import{j as e}from"./framer-motion-j99QkFjP.js";import{r as a}from"./react-vendor-Bj3LDE8x.js";import{l as n,d as o}from"./index-DjpFl4gM.js";function i(t){return t.replace(/^### (.+)$/gm,'<h3 class="text-sm font-bold text-white/80 mt-3 mb-1">$1</h3>').replace(/^## (.+)$/gm,'<h2 class="text-base font-bold text-white/80 mt-4 mb-1">$1</h2>').replace(/^# (.+)$/gm,'<h1 class="text-lg font-bold text-white/90 mt-4 mb-2">$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong class="text-white/80">$1</strong>').replace(/\*(.+?)\*/g,'<em class="text-white/60">$1</em>').replace(/`(.+?)`/g,'<code class="text-[#dc2626] bg-white/5 px-1 rounded text-xs">$1</code>').replace(/^- (.+)$/gm,'<li class="text-sm text-white/60 ml-4 list-disc">$1</li>').replace(/^(\d+)\. (.+)$/gm,'<li class="text-sm text-white/60 ml-4 list-decimal">$2</li>').replace(/^(?!<[hlu])(.+)$/gm,'<p class="text-sm text-white/60 leading-relaxed mb-1">$1</p>')}function m(){const[t,s]=a.useState(()=>n("md-content",`# Hello DragonOS

This is a **markdown** editor.

- Item one
- Item two
- Item three

## Features

Write in the *left panel*, see the preview on the *right*.

\`Code\` is supported too!`)),l=r=>{s(r),o("md-content",r)};return e.jsxs("div",{className:"flex h-full font-inter",children:[e.jsxs("div",{className:"flex-1 border-r border-white/5 flex flex-col",children:[e.jsx("div",{className:"px-3 py-1.5 border-b border-white/5 text-[9px] text-white/20 uppercase tracking-wider",children:"Editor"}),e.jsx("textarea",{value:t,onChange:r=>l(r.target.value),className:"flex-1 bg-transparent p-3 text-xs text-white/60 outline-none resize-none font-mono leading-relaxed",placeholder:"Write markdown..."})]}),e.jsxs("div",{className:"flex-1 flex flex-col",children:[e.jsx("div",{className:"px-3 py-1.5 border-b border-white/5 text-[9px] text-white/20 uppercase tracking-wider",children:"Preview"}),e.jsx("div",{className:"flex-1 p-3 overflow-y-auto",dangerouslySetInnerHTML:{__html:i(t)}})]})]})}export{m as default};
