import { postcssIsolateStyles } from 'vitepress'

export default {
  plugins: [
    postcssIsolateStyles({
      // https://github.com/vuejs/vitepress/issues/3303#issuecomment-1873967295
      includeFiles: [/vp-doc\.css/, /base\.css/], // defaults to /base\.css/
    }),
  ],
}
