import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.MODE": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
  },
  plugins: [react(), tailwindcss()],
});
