window.onload = async () => {

	const ROOM_ID = "xyz"

	const socket = io('localhost:3000', {
		transports: ["polling"]
	})

	const GRID = document.getElementById('video-grid')
	const videoCountEl = document.getElementById('video-count')

	const peer = new Peer(undefined, {
		path: '/peerjs',
		host: 'localhost',
		port: '3000'
	})

	function updateView () {
		const videoCount = GRID.querySelectorAll('.card').length
		videoCountEl.innerText = videoCount
	}

	function createCardElement (elementId) {
		const card = document.createElement("div")
		card.classList.add("col-4","card","p-0")
		card.id = elementId

		const cardBody = document.createElement("div")
		cardBody.classList.add("card-body")

		const cardTitle = document.createElement("h5")
		cardTitle.classList.add("card-title")
		cardTitle.innerText = elementId

		card.append(cardBody)
		cardBody.append(cardTitle)
		return card
	}

	function addVideoStream(peerId, stream) {
		const video = document.createElement("video")
		video.srcObject = stream
		video.autoplay = true
		video.addEventListener('loadedmetadata', () => {
			video.play()

			const card = createCardElement(peerId)
			GRID.append(card)
			card.prepend(video)
			updateView()
		})
	}

	function removeVideoStream(peerId) {
		const div = document.getElementById(peerId)
		div.remove()
		updateView()
	}

	function makeCallToNewUser(peerId) {
		const canvas = document.createElement('canvas')
		const stream = canvas.captureStream()
		const track = stream.getVideoTracks()[0]
		const mediaStream = new MediaStream([track])

		const call = peer.call(peerId, mediaStream)

		call.on("stream", (remoteStream) => {
			console.log('receiving stream')
			addVideoStream(peerId, remoteStream)
		})

		call.on('error', (err) => {
			console.log('Stream Fail', err)
		})
	}

    peer.on("open", (peerId) => {
    	console.log(`peer connection open: ${peerId}`)
		socket.emit("want-join-room", ROOM_ID, peerId)
	})

    socket.on("user-connected", (peerId) => {
    	console.log(`connected ${peerId}`)
    	makeCallToNewUser(peerId)
    })

    socket.on('stop-stream', (peerId) => {
    	console.log('end stream', peerId)
		removeVideoStream(peerId)
    })
}