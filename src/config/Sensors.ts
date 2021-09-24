class Sensors {

	deviceOrientation(callback) {
		this.handleEnvent("deviceorientation", callback)
	}

	deviceMotion(callback) {
		this.handleEnvent("devicemotion", callback)
	}

	handleEnvent(eventName, callback) {
		window.addEventListener(eventName, (e) => { if (callback) callback(e) }, true)
	}
}

export default Sensors