// module.exports = {
//   chainWebpack: config => {
//     config.module.rules.delete("svg");
//   },
//   configureWebpack: {
//     module: {
//       rules: [
//         {
//           test: /\.svg$/, 
//           loader: 'vue-svg-loader', 
//         },
//       ],
//     }      
//   }
// };

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
   ? '/oidc-client/'
   : '/'
}