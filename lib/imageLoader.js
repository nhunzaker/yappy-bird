var Promise = require('es6-promise').Promise;

module.exports = function preload (src) {
	if (Array.isArray(src)) {
		return Promise.all(src.map(preload));
	}

	return new Promise(function(resolve, reject) {
		var img = new Image();

		img.onload = function() {
			resolve(img);
		};

		img.onerror = function() {
			reject(new Error("Image " + src + " failed to load."))
		}

		img.src = src;
	});
};
