/*jshint esversion: 6 */

module.exports = function(callback, params) {
	console.warn('\nserver main.js => [execution]');
	try {
		if (callback && params) {
			// console.log(params);
			// console.log(process.env);
			let slug = Object.keys(process.env)
				.find(x => x.indexOf('npm_config_slug') === 0);
			slug = slug ? slug.split('npm_config_slug_')[1] : '/';
			// console.log(slug);
			params[3] = slug;
			params.unshift((error, result) => {
				if (error) {
					console.warn('\n/dist/server/main.js => [error]');
					console.log(error);
					console.log(result || '');
				} else {
					console.warn('\n/dist/server/main.js => [result]');
					console.log(result);
				}
			});
			callback.apply(this, params);
		}
	} catch (error) {
		console.warn('\n/dist/server/main.js => [error]');
		console.log(error);
	}
};
