export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not ie 11',
        'iOS >= 10',
        'Android >= 5'
      ],
      grid: 'autoplace',
      flexbox: 'no-2009'
    },
  },
}
