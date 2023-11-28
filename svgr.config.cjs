module.exports = {
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  ref: true,
  typescript: true,
  icon: true,
  replaceAttrValues: {
    '#000': 'currentColor',
  },
};
