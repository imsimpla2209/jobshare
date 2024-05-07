import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import module from "module";
import fs from "fs";
import path from "path";

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

function reactVirtualized() {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const require = module.createRequire(import.meta.url);
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js"),
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      fs.writeFileSync(file, modified);
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.tsx",
  }), reactVirtualized()],
  define: {
    'process.env': process.env,
    global: {},
  },
  server: {
    // hmr: {
    //   overlay: false
    // },
    proxy: {
      '/v1': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      }
      //'/api': 'http://127.0.0.1:8033'
    },
    host: 'localhost',
    port: 6996,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      // root: path.join(__dirname, './src/'),
      // "@": path.resolve(__dirname, "./src/"),
      // "": `${path.resolve(__dirname, "./src/")}`,
      "src": path.resolve(__dirname, "./src/"),
      Components: `${path.resolve(__dirname, "./src/Components/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages/"),
      utils: path.resolve(__dirname, "./src/utils/"),
      api: path.resolve(__dirname, "./src/api/"),
      Routes: path.resolve(__dirname, "./src/Routes/"),
      Network: path.resolve(__dirname, "./src/Network/"),
      Store: path.resolve(__dirname, "./src/Store/"),
      assets: path.resolve(__dirname, "./src/assets/"),
      constants: path.resolve(__dirname, "./src/constants/"),
      Context: path.resolve(__dirname, "./src/Context/"),
      hooks: path.resolve(__dirname, "./src/hooks/"),
      LayOut: path.resolve(__dirname, "./src/LayOut/"),
      libs: path.resolve(__dirname, "./src/libs/"),
      types: `${path.resolve(__dirname, "./src/types/")}`,
    },
  },
})
