/* eslint-disable */
const path = require('path')

module.exports = {
	productionSourceMap: false,
	configureWebpack: {
		resolve: {
			alias: {
				'@': path.join(__dirname, './src')
			}
		}
	},
	devServer: {
		proxy: {
			'/api': {
				target: process.env.VUE_APP_API_URL,
				ws: true,
				changeOrigin: true,
			},
		},
		port: 9010,
	},

	pluginOptions: {
	  i18n: {
		locale: 'ko',
		fallbackLocale: 'en',
		localeDir: 'locales',
		enableLegacy: false,
		runtimeOnly: false,
		// compositionOnly: false,
		fullInstall: true
	  }
	}

	
}
