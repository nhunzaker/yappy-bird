module.exports = function() {
	(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);
};
