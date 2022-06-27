
const webpackConfig = {
    target: 'node',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
    node: {'fs': 'empty', 'readline': 'empty'},
    modules: ['src', 'node_modules'],
  };
module.exports = webpackConfig;