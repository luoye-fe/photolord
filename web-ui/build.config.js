module.exports = {
  publicPath: './',
  hash: 'contenthash',
  outputDir: '../dist/app/public',
  plugins: [
    ['build-plugin-antd', {
      themeConfig: {
        
      },
      importOptions: {
        libraryDirectory: 'es',
        style: true,
      },
    }],
  ],
};
