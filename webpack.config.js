const webpack = require('webpack');

module.exports = {
  // other webpack configuration options...
  output: {
    // other output options...
    hashFunction: 'md4', // Specify the hashing algorithm here
  },
  plugins: [
    // other plugins...
    new webpack.LoaderOptionsPlugin({
      options: {
        // other loader options...
        output: {
          // other output options...
          hashFunction: 'md4', // Specify the hashing algorithm here as well
        },
      },
    }),
  ],
};