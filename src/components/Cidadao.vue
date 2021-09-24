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

import { set, push } from 'firebase/database'
import { transmissaoRef } from '../config/Firebase.ts'

export default {
	name: 'Cidadao',
	components: { Layout },
	data() {
		return {
			peer: new Peer(),
			stream: null,
			sharedData: {}
		}
	},
	methods: {
		async startStream() {
			try {
				this.stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				})

				this.peer = new Peer()
				
			   	this.peer.on("open", (peerId) => {
			   		this.sharedData.peerId = peerId
			   		this.saveData()
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
				const coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
				this.sharedData.coords = coords
			}
		},
		async saveData() {
			await this.getGeoLocation()
			this.sharedData.active = true
			
			const newRef = push(transmissaoRef)
			
			try {
				await set(newRef, this.sharedData)
			}
			catch(err) {
				console.log(err)
			}
		}
	},
	created() {
		/*const nome = prompt('Informe o seu nome')
		this.sharedData.nome = nome

		const natureza = prompt('Natureza do evento')
		this.sharedData.natureza = natureza*/

		const sensors = new Sensors()
		sensors.deviceMotion(console.log)
	}
}
</script>