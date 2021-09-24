<template>
	<Layout>
		<div class="ui segment basic">
			<div class="ui grid three column stackable centered">
				<div class="two column centered row">
					<button
						@click="startStream"
						class="ui button" :disabled="stream">
						Compartilhar a câmera
					</button>
				</div>

				<div class="two column centered row">
					<button
						@click="stopStream"
						class="ui button" :disabled="!stream">
						Parar de transmitir
					</button>
				</div>
			</div>
		</div>
	</Layout>
</template>

<script>

import Layout from '../Layout.vue'

import Sensors from '../config/Sensors.ts'
import Peer from 'peerjs'

import { randomNatureza, randomNome } from '../config/NaturezaEvento.ts'

//import { set, push } from 'firebase/database'
//import { transmissaoRef } from '../config/Firebase.ts'

export default {
	name: 'Cidadao',
	components: { Layout },
	data() {
		return {
			peer: new Peer(),
			stream: null,
			sharedData: {
				active: true,
				nome: randomNome(),
				naturezaId: randomNatureza().id,
				peerId: null,
				coords: {},
				dm: {}
			}
		}
	},
	methods: {
		async startStream() {
			const lastPeerId = sessionStorage.getItem("peerId") || null
			try {
				this.stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				})

				this.peer = new Peer(lastPeerId)
				
			   	this.peer.on("open", (peerId) => {
			   		this.sharedData.peerId = peerId
			   		sessionStorage.setItem("peerId", peerId)
			   		console.log('myPeerId', peerId)
			   	})
			   	this.peer.on('connection', (conn) => {
			   		conn.on('open', async () => {
			   			await this.saveData()
			   			conn.send(this.sharedData)
			   		})
			   	})
				this.peer.on('disconnected', () => {})
				this.peer.on("call", (call) => call.answer(this.stream))
			}
			catch(err) {
				console.log('fail to get media stream', err)
			}
		},
		stopStream() {
			if (this.stream.active) {
				this.stream.getTracks().forEach(track => track.stop())
				this.stream = null
				this.peer.destroy()
			}
		},
		async getGeoLocation() {
			if (navigator.geolocation) {

				const position = await new Promise((resolve, reject) => {
		          navigator.geolocation.getCurrentPosition(resolve, reject)
		        })

				this.sharedData.coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			}
		},
		async getDeviceMotion() {
			try {
				const sensors = new Sensors()
				const dm = await sensors.deviceMotion()
				this.sharedData.dm = dm
			}
			catch(err) {
				console.log(err)
			}
		},
		async saveData() {
			await this.getGeoLocation()
			await this.getDeviceMotion()
			console.log(this.sharedData)
			/*const newRef = push(transmissaoRef)
			
			try {
				await set(newRef, this.sharedData)
			}
			catch(err) {
				console.log(err)
			}*/
		}
	},
	created() {}
}
</script>