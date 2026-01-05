import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const BACKEND_URL = "http://8.148.217.172:8080";
const BACKEND_URL_API = "http://8.148.217.172:8080/api";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      dts: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
      directoryAsNamespace: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@views": resolve(__dirname, "src/views"),
      "@utils": resolve(__dirname, "src/utils"),
      "@api": resolve(__dirname, "src/api"),
      "@assets": resolve(__dirname, "src/assets"),
      "@stores": resolve(__dirname, "src/stores"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@use '@/styles/variables.scss' as *;",
      },
    },
  },
  server: {
    port: 5175,
    open: true,
    proxy: {
      "/api": {
        target: BACKEND_URL_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
