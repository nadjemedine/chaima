import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local backend mock for Vite dev server so you don't need `vercel dev`
const devBackendPlugin = (env: Record<string, string>) => ({
  name: 'dev-backend',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/create-checkout' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body);
            const payload = {
              amount: parsed.amount,
              currency: "dzd",
              success_url: `${env.VITE_APP_URL || "http://localhost:5173"}/success`,
              failure_url: `${env.VITE_APP_URL || "http://localhost:5173"}/`,
              description: parsed.product_title || "Coach Chaima Plans",
              metadata: [
                { customer_name: parsed.customer_name },
                { requested_mode: parsed.mode }
              ]
            };

            const response = await fetch("https://pay.chargily.net/api/v2/checkouts", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${env.CHARGILY_APP_SECRET}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: response.ok,
              payment_url: data.checkout_url,
              payment_id: data.id,
              message: response.ok ? 'تم التوجيه للدفع' : 'حدث خطأ من الدفع'
            }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: 'Server error' }));
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), viteSingleFile(), devBackendPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      },
    },
  };
});
