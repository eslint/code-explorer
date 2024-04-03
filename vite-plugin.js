import path from "path";
import { fileURLToPath } from "url";
import * as cjsModuleLexer from "cjs-module-lexer";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const eslintRoot = path.resolve(projectRoot, "node_modules/eslint");

/**
 * Transform `require()` to `import`
 * @param code
 */
function transformRequire(code) {
    if (!code.includes("require") && !code.includes("module.exports") && !code.includes("exports.")) {
        return code;
    }
    const modules = new Map();
    const replaced = code.replace(
        /(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)|\brequire\s*\(\s*(["'].*?["'])\s*\)/gu,
        (match, comment, moduleString) => {
            if (comment) {
                return match;
            }

            let id =
        `__${
            moduleString.replace(/[^a-zA-Z0-9_$]+/gu, "_")
        }${Math.random().toString(32).slice(2)}`;

            while (code.includes(id) || modules.has(id)) {
                id += Math.random().toString(32).slice(2);
            }
            modules.set(id, moduleString);
            return `${id}()`;
        }
    ).replace(/\bprocess\.cwd\(\)/gu, '"/"');

    const { exports } = cjsModuleLexer.parse(code);

    return (
        `${[...modules]
            .map(([id, moduleString]) => `import * as __temp_${id} from ${moduleString};
const ${id} = () => {
    const m = __temp_${id}.default || __temp_${id};
    if (!m || __temp_${id}.__vite_commonjs || !__temp_${id}.default || (typeof m !== 'object' && typeof m !== 'function')) return m;
    return new Proxy(m, {
        get: (target, prop) => {
            return prop in m ? m[prop] : prop === 'default' ? m : void 0
        }
    });
};`)
            .join("")
        };const __module = {exports:{}};((exports, module) => {${replaced}})(__module.exports, __module);
${exports.map(e => `export const ${e} = __module.exports.${e};`).join("\n")}
export default __module.exports;
export const __vite_commonjs = true`
    );
}

export function viteCommonjs() {
    return {
        name: "vite-plugin-cjs-to-esm",
        apply: () => true,
        async transform(code, id) {
            if (!id.startsWith(`${eslintRoot}/`)) {
                return void 0;
            }
            await cjsModuleLexer.init();
            try {
                return transformRequire(code);
            } catch (e) {
                // eslint-disable-next-line no-console -- use in CLI
                console.error(`Transform error. code:\n${code}`, e);
            }
            return void 0;
        }
    };
}
