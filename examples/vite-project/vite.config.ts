import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteClickToVueComponent from '@click-to-vue-component/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [viteClickToVueComponent(), vue()],
})
