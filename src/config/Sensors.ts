class Sensors {

	deviceOrientation() {
		return this.handleEnvent("deviceorientation")
	}

	deviceMotion() {
		return this.handleEnvent("devicemotion")
	}

	handleEnvent(eventName) {
		return new Promise((resolve, reject) => {
			if (window.DeviceMotionEvent) {
				window.addEventListener(eventName, (e) => {
					const dm = {
						acceleration: {
							x: e.acceleration.x,
							y: e.acceleration.y,
							z: e.acceleration.z
						},
						rotationRate: {
							alpha: e.rotationRate.alpha,
							beta: e.rotationRate.beta,
							gamma: e.rotationRate.gamma
						}
					}
					resolve(dm)
				})	
			}
			else {
				reject("DeviceMotionEvent not supported")
			}
		})
	}
}

export default Sensors