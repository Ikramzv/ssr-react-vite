import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const data = await fs.readFile(path.resolve(__dirname, "index.html"), {
      encoding: "utf8",
      flag: "r",
    });
    try {
      const url = req.originalUrl;
      let template = await vite.transformIndexHtml(url, data);

      const { render } = await vite.ssrLoadModule("./src/server");
      const rendered = await render();

      const comment = "<!--ssr-oultet-here-->";
      const html = template.replace(
        comment,
        `
        ${rendered.html}
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify({
            name: "Ikram",
            surname: "Zulfugar",
          })}
          window.__APP_DATA__ = ${JSON.stringify(
            (await rendered.fn()).props.data
          )}
        </script>
      `
      );
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      console.log(error);
      return res.sendStatus(500);
    }
  });

  app.listen(5173, () => {
    console.log("App is launced");
  });
})();
