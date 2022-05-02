import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import legacy from '@vitejs/plugin-legacy';
const svgrPlugin = require('vite-plugin-svgr');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgrPlugin({ svgrOptions: { icon: true } }), react()],
  define: {
    global: {},
  },
  esbuild: {
    jsxFactory: `jsx`,
    jsxInject: `import { jsx } from '@emotion/react'`,
  },
  // resolve: {
  //   alias: { stream: require.resolve('stream-browserify') },
  // },
});
