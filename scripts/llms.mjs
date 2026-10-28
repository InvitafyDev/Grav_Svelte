// Genera static/llms.txt desde el código de src/lib: los componentes y funciones que
// exporta cada módulo, con sus props (`export let`: tipo, valor por defecto y comentario),
// eventos, slots y las interfaces públicas. La introducción está en scripts/llms-intro.md.
//
// Uso: node scripts/llms.mjs
// Se corre después de cambiar una prop, un export o una interfaz: así llms.txt no se
// desfasa del código, como pasó cuando se escribía a mano.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { parse } from "svelte/compiler";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LIB = path.join(RAIZ, "src/lib");
const MODULOS = ["Inputs", "CRUD", "Modals", "Alerts", "Sidebar", "Accordion", "Preview"];

const leer = (p) => fs.readFileSync(p, "utf8");
const conTs = (p) => (fs.existsSync(p) ? p : p.replace(/\.js$/, ".ts"));
const limpiar = (t) => t.replace(/\s+/g, " ").trim();
const sinComentario = (t) =>
  t
    .replace(/^\/\*\*?|\*\/$/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").replace(/^\s*\/\/\s?/, ""))
    .join(" ")
    .trim();

function comentarioDe(nodo, fuente) {
  const rangos = ts.getLeadingCommentRanges(fuente, nodo.pos) ?? [];
  // Un comentario de sección («// Props») no describe la primera prop que lo sigue.
  const seccion = /^((default |common )?props|event handlers from parent|exported values\b.*)$/i;
  const texto = rangos
    .map((r) => sinComentario(fuente.slice(r.pos, r.end)))
    .filter((t) => !seccion.test(t))
    .join(" ");
  const fin = fuente.indexOf("\n", nodo.end);
  const cola = fuente.slice(nodo.end, fin === -1 ? undefined : fin).match(/\/\/\s?(.*)$/);
  return limpiar([texto, cola?.[1]].filter(Boolean).join(" "));
}

function componente(archivo) {
  const fuente = leer(archivo);
  const ast = parse(fuente);
  const script = ast.instance ? fuente.slice(ast.instance.content.start, ast.instance.content.end) : "";
  const sf = ts.createSourceFile("c.ts", script, ts.ScriptTarget.Latest, true);
  const props = [];
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    if (!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const nota = comentarioDe(st, script);
    for (const d of st.declarationList.declarations) {
      props.push({
        nombre: d.name.getText(sf),
        tipo: d.type ? limpiar(d.type.getText(sf)) : null,
        defecto: d.initializer ? limpiar(d.initializer.getText(sf)) : null,
        constante: st.declarationList.flags & ts.NodeFlags.Const,
        nota,
      });
    }
  }
  const eventos = [...new Set([...script.matchAll(/dispatch\(\s*["'`]([\w:-]+)/g)].map((m) => m[1]))];
  const slots = [...new Set([...fuente.matchAll(/<slot\b([^>]*)>/g)].map((m) => m[1].match(/name="([^"]+)"/)?.[1] ?? "(por defecto)"))];
  return { props, eventos, slots };
}

function exportsDe(indice) {
  const fuente = leer(indice);
  const sf = ts.createSourceFile("i.ts", fuente, ts.ScriptTarget.Latest, true);
  const comps = [];
  const funciones = [];
  const tipos = [];
  for (const st of sf.statements) {
    if (!ts.isExportDeclaration(st) || !st.moduleSpecifier || !st.exportClause) continue;
    const desde = conTs(path.join(path.dirname(indice), st.moduleSpecifier.text));
    for (const el of st.exportClause.elements) {
      const nombre = el.name.text;
      const original = el.propertyName?.text ?? nombre;
      if (st.isTypeOnly || el.isTypeOnly) tipos.push({ nombre, desde });
      else if (original === "default" && desde.endsWith(".svelte")) comps.push({ nombre, archivo: desde });
      else funciones.push({ nombre, desde });
    }
  }
  return { comps, funciones, tipos };
}

// Declaraciones exportadas de un .ts (funciones, interfaces, tipos), tal como están escritas.
function declaraciones(archivo, nombres) {
  const fuente = leer(archivo);
  const sf = ts.createSourceFile("d.ts", fuente, ts.ScriptTarget.Latest, true);
  const salida = [];
  for (const st of sf.statements) {
    const nombre = ts.isVariableStatement(st) ? st.declarationList.declarations[0].name.getText(sf) : st.name?.text;
    if (!nombre || !nombres.has(nombre)) continue;
    if (ts.isFunctionDeclaration(st)) {
      const params = st.parameters.map((p) => limpiar(p.getText(sf))).join(", ");
      const nota = comentarioDe(st, fuente);
      salida.push(`function ${nombre}(${params})${st.type ? ": " + limpiar(st.type.getText(sf)) : ""}${nota ? "  // " + nota : ""}`);
    } else if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) {
      salida.push(st.getText(sf).replace(/^export\s+/, ""));
    } else if (ts.isVariableStatement(st)) {
      salida.push(limpiar(st.getText(sf)).replace(/^export\s+/, ""));
    }
  }
  return salida;
}

// Tipos que un módulo reexporta y las interfaces que esos tipos usan (de interfaces.ts).
function tiposPublicos(tipos) {
  const porArchivo = new Map();
  for (const t of tipos) {
    if (!porArchivo.has(t.desde)) porArchivo.set(t.desde, new Set());
    porArchivo.get(t.desde).add(t.nombre);
  }
  const bloques = [];
  for (const [archivo, nombres] of porArchivo) {
    const fuente = leer(archivo);
    // Las interfaces exportadas del mismo archivo que usan los tipos públicos, también.
    for (const m of fuente.matchAll(/export\s+(?:interface|type)\s+(\w+)/g)) nombres.add(m[1]);
    bloques.push(...declaraciones(archivo, nombres));
  }
  return bloques;
}

let salida = leer(path.join(RAIZ, "scripts/llms-intro.md")).trimEnd() + "\n";
for (const modulo of MODULOS) {
  const indice = conTs(path.join(LIB, modulo, "index.js"));
  const { comps, funciones, tipos } = exportsDe(indice);
  salida += `\n## ${modulo}  ·  import { … } from 'grav-svelte/${modulo}'\n`;
  if (funciones.length) {
    salida += "\n### Funciones y stores\n\n```ts\n";
    const porArchivo = new Map();
    for (const f of funciones) porArchivo.set(f.desde, [...(porArchivo.get(f.desde) ?? []), f.nombre]);
    for (const [archivo, nombres] of porArchivo) salida += declaraciones(archivo, new Set(nombres)).join("\n") + "\n";
    salida += "```\n";
  }
  for (const c of comps) {
    const { props, eventos, slots } = componente(c.archivo);
    salida += `\n### ${c.nombre}\n\n`;
    const lista = props.filter((p) => !p.constante);
    if (lista.length) {
      salida += "Props:\n";
      for (const p of lista) {
        const tipo = p.tipo ? `: ${p.tipo}` : "";
        const def = p.defecto === null ? " (requerida)" : ` = ${p.defecto}`;
        salida += `- \`${p.nombre}${tipo}\`${def}${p.nota ? ` — ${p.nota}` : ""}\n`;
      }
    } else salida += "Sin props.\n";
    if (eventos.length) salida += `Eventos (on:…): ${eventos.join(", ")}\n`;
    if (slots.length) salida += `Slots: ${slots.join(", ")}\n`;
  }
  const bloques = tiposPublicos(tipos);
  if (bloques.length) salida += "\n### Tipos\n\n```ts\n" + bloques.join("\n\n") + "\n```\n";
}
fs.writeFileSync(path.join(RAIZ, "static/llms.txt"), salida);
console.log(`static/llms.txt: ${salida.split("\n").length} renglones`);
