module.exports = {
  publicPath: './',
  hash: 'contenthash',
  outputDir: '../dist/app/public',
  plugins: [
    ['build-plugin-antd', {
      themeConfig: {
        'primary-color': '#e9a049',
      },
      importOptions: {
        libraryDirectory: 'es',
        style: true,
      },
    }],
  ],
};
