import fs from "fs";
import path from "path";

const UI_DIR = path.resolve("src/ui");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(jsx|js)$/.test(ent.name) && ent.name !== "icons.js") {
      let c = fs.readFileSync(p, "utf8");
      const o = c;
      c = c
        .replace(/from ['"]\.\.\/utils/g, "from '../../utils")
        .replace(/from ['"]\.\.\/hooks/g, "from '../../hooks")
        .replace(/from ['"]\.\.\/data/g, "from '../../data")
        .replace(/from ['"]\.\.\/config/g, "from '../../config");
      if (c !== o) {
        fs.writeFileSync(p, c);
        console.log("fixed", p);
      }
    }
  }
}

walk(UI_DIR);
