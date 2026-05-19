import fs from "fs";

const src = fs.readFileSync("src/ui/index.css", "utf8");
const lines = src.split(/\r?\n/);
const themeEnd = lines.findIndex((l) => l.includes("/* ─── Reset i base"));
const theme = lines.slice(0, themeEnd).filter((l) => !l.includes("@tailwind")).join("\n");
const components = lines.slice(themeEnd).join("\n");

fs.mkdirSync("src/ui/styles", { recursive: true });
fs.writeFileSync("src/ui/styles/theme.css", theme.trim() + "\n");
fs.writeFileSync("src/ui/styles/components.css", components.trim() + "\n");

const index = `/* FILE: index.css | PATH: src/ui/index.css | VERSION: 0.0.3 */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './styles/theme.css';
@import './styles/components.css';
@import './layout.css';

.toast-success { background: var(--success); color: #fff; border: none; }
.toast-error { background: var(--danger); color: #fff; border: none; }
.toast-warning { background: var(--warning); color: #1e293b; border: none; }
`;
fs.writeFileSync("src/ui/index.css", index);
console.log("CSS split OK");
