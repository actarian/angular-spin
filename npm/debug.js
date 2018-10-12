module.exports = function(callback, params) {
	console.warn('\nserver main.js => [execution]');
	try {
		if (callback && params) {
			params.unshift((error, result) => {
				if (error) {
					console.warn('\n/dist/server/main.js => [error]');
					console.log(error);
					console.log(result || '');
				} else {
					console.warn('\n/dist/server/main.js => [result]');
					console.log(result)
				}
			});
			callback.apply(this, params);
		}
	} catch (error) {
		console.warn('\n/dist/server/main.js => [error]');
		console.log(error);
	}
};
