
<template>
	<Layout>
		<div class="ui segment basic">
			<div class="ui grid three column stackable centered">
				<div class="two column">
					<div id="video-content">
						<div class="ui message negative">
							<div class="header">
								Natureza da Ocorrência
							</div>
							<p>Incêndio Florestal</p>
						</div>
						<video
							style="width: 100%;" 
							id="videotag" autoplay></video>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>

<script>

import Layout from '../Layout.vue'
import Peer from 'peerjs'

export default {
	name: 'Stream',
	components: { Layout },
	data() {
		return {
			conn: null,
			peer: new Peer()
		}
	},
	methods: {
		makeCall() {
			const canvas = document.createElement('canvas')
			const stream = canvas.captureStream()
			const track = stream.getVideoTracks()[0]
			const mediaStream = new MediaStream([track])

			const call = this.peer.call(this.$route.params.peerId, mediaStream)
			this.conn = this.peer.connect(this.$route.params.peerId)

			this.conn.on("open", () => console.log(`pair connection opened`))

			this.conn.on("close", () => {
				console.log(`pair connection closed`)
				this.endStream()
			})

			call.on("stream", (remoteStream) => {
				console.log('receiving stream')
				this.addVideoStream(remoteStream)
			})

			call.on('error', (err) => console.log('Stream Fail', err))
		},
		addVideoStream(remoteStream) {
			const video = document.getElementById("videotag")
			video.srcObject = remoteStream
			video.autoplay = false
			video.muted = true
			video.addEventListener('loadedmetadata', () => video.play())
		},
		async endStream() {
			alert("Encerrada a transmissão")
			window.close()
		}
	},
	created() {

		this.peer.on("open", (myId) => {
			console.log(`Connected to Peer server: ${myId}`)
			this.makeCall()
		})

		this.peer.on('close', () => console.log('Peer server connection closed'))
	}
}
</script>