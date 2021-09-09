window.onload = async () => {

	const ROOM_ID = "xyz"

	const socket = io('localhost:3000', {
		transports: ["polling"]
	})

	let stream, peer, myPeerId

	const btnStart = document.getElementById("btn-start")
	const btnStop = document.getElementById("btn-stop")

	async function startRecord () {
		btnStart.setAttribute("disabled", true)
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			})

			peer = new Peer(undefined, {
				path: '/peerjs',
				host: 'localhost',
				port: '3000'
			})

			peer.on("call", (call) => call.answer(stream))

		   peer.on("open", (peerId) => {
		    	myPeerId = peerId
				socket.emit("want-join-room", ROOM_ID, myPeerId)
				btnStop.removeAttribute("disabled")
			})

			peer.on('disconnected', () => {
				socket.emit("want-stop-stream", ROOM_ID, myPeerId)
				btnStart.removeAttribute("disabled")
			})
		}
		catch(err) {
			console.log('fail to get media stream', err)
			btnStart.removeAttribute("disabled")
		}
	}

	btnStart.addEventListener('click', (e) => startRecord())

	btnStop.addEventListener('click', (e) => {
		btnStop.setAttribute("disabled", true)
		if (stream.active) {
			stream.getTracks().forEach(track => track.stop())
			stream = null
			peer.destroy()
		}
	})
}