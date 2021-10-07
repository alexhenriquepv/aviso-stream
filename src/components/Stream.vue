
<template>
	<Layout>
		<div class="ui segment basic">
			<div class="ui grid centered stackable">

				<div class="ten wide column">
					<div id="video-content">
						<video
							style="width: 100%;" 
							id="videotag" autoplay></video>
					</div>
				</div>

				<div class="six wide column">
					<table class="ui table inverted celled" v-if="peerData">
						<tbody>
							<tr>
								<td>Natureza</td>
								<td colspan="3">{{ peerData.naturezaNome }}</td>
							</tr>
							<tr>
								<td>Solicitante</td>
								<td colspan="3">{{ peerData.nome }}</td>
							</tr>
							<tr v-if="peerData.coords">
								<td>Coordenadas</td>
								<td colspan="3">{{ peerData.coords.lat }}  {{ peerData.coords.lng }}</td>
							</tr>
							<tr v-if="peerData.dm.acceleration">
								<td>Movimento</td>
								<td>x:  {{ peerData.dm.acceleration.x }}</td>
								<td>y:  {{ peerData.dm.acceleration.y }}</td>
								<td>z:  {{ peerData.dm.acceleration.z }}</td>
							</tr>
							<tr v-if="peerData.dm.rotationRate">
								<td>Orientação</td>
								<td>Alpha:  {{ peerData.dm.rotationRate.alpha }}</td>
								<td>Beta:  {{ peerData.dm.rotationRate.beta }}</td>
								<td>Gamma:  {{ peerData.dm.rotationRate.gamma }}</td>
							</tr>
						</tbody>
					</table>
				</div>

				
			</div>
		</div>
	</Layout>
</template>

<script>

import Layout from '../Layout.vue'
import Peer from 'peerjs'
import { naturezaPorId } from '../config/NaturezaEvento.ts'

const lastPeerId = sessionStorage.getItem("peerId") || null

export default {
	name: 'Stream',
	components: { Layout },
	data() {
		return {
			conn: null,
			peer: new Peer(lastPeerId),
			peerData: {
				coords: {},
				dm: { acceleration: {}, rotationRate: {} }
			}
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

			this.conn.on('data', data => {
				this.peerData = data
				this.peerData.naturezaNome = naturezaPorId(data.naturezaId).nome
				console.log(this.peerData)
			})

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
			sessionStorage.setItem("peerId", myId)
			this.makeCall()
		})

		this.peer.on('close', () => console.log('Peer server connection closed'))
	}
}
</script>