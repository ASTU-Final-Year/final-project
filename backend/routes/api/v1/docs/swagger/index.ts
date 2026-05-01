import { html, RouterHandlers } from "@bepalo/router";
import swaggerDocs from "~/api.doc.yml";

export default {
  GET: {
    HANDLER: [
      () =>
        html(
          `
              <!DOCTYPE html>
              <html>
                <head>
                  <link rel="stylesheet" href="/api/swagger-ui.css" />
                </head>
                <body>
                  <div id="swagger-ui"></div>
                  <script src="/api/swagger-ui-bundle.js"></script>
                  <script>
                    SwaggerUIBundle({
                      spec: ${JSON.stringify(swaggerDocs)},
                      dom_id: '#swagger-ui',
                      presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                      ],
                    });
                  </script>
                </body>
              </html>
            `,
        ),
    ],
  },
} satisfies RouterHandlers;
