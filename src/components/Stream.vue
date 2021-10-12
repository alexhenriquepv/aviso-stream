
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
								<td colspan="3">{{ naturezaNome }}</td>
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
import { naturezaPorId } from '../config/Helpers.ts'

import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { update, child } from 'firebase/database'
import { appStorage, ocorrenciaRef } from '../config/Firebase.ts'

const lastPeerId = sessionStorage.getItem("peerId") || null

export default {
	name: 'Stream',
	components: { Layout },
	data() {
		return {
			conn: null,
			recorder: null,
			naturezaNome: null,
			chunks: [],
			peer: new Peer(lastPeerId),
			peerData: {
				id: null,
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
				this.naturezaNome = naturezaPorId(data.naturezaId).nome
				console.log(this.peerData)
			})

			this.conn.on("close", () => {
				console.log(`pair connection closed`)
				this.endStream()
				this.recorder.stop()
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
			video.addEventListener('loadedmetadata', () => {
				this.recordVideo(video, remoteStream)
			})
		},
		recordVideo(videoObject, stream) {
			this.recorder = new MediaRecorder(stream)
			this.recorder.ondataavailable = (e) => { this.chunks.push(e.data) }
			this.recorder.onstop = async () => {
				const blob = new Blob(this.chunks, { type: 'video/mp4' })
				videoObject.srcObject = null
				videoObject.src = URL.createObjectURL(blob)
				videoObject.controls = true
				this.uploadVideo(blob)
			}

			videoObject.play()
			this.recorder.start()
		},
		async uploadVideo(blob) {
			const filePath = `ocorrencias/${this.peerData.id}.mp4`
			const ref = storageRef(appStorage, filePath)
			
			try {
				const uploadRes = await uploadBytes(ref, blob, { contentType: 'video/mp4' })
				console.log(uploadRes)
				const recordUrl = await getDownloadURL(ref)

				const clientRef = child(ocorrenciaRef, this.peerData.id)
				update(clientRef, { recordUrl })
			}
			catch(err) {
				console.log('Fail on upload', err)
			}
		},
		async endStream() {
			alert("Encerrada a transmissão")
		}
	},
	created() {
		this.peer.on("open", (myId) => {
			console.log(`Connected to Peer server: ${myId}`)
			sessionStorage.setItem("peerId", myId)
			this.makeCall()
		})

		this.peer.on('disconnected', () => console.log('Peer server connection closed'))
		this.peer.on('close', () => console.log('Peer server connection closed'))
	}
}
</script>