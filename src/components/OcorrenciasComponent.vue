<template>
	<div class="ui items divided" style="overflow: auto;max-height: 500px;">
	  	
	  	<div class="item" v-if="!ocorrencias.length">
	  		<div class="content">
	  			<div class="header">Nenhuma ocorrência</div>
	  			<div class="description">Aguardando novos registros..</div>
	  		</div>
	  	</div>

	  	<div class="item" v-for="t in ocorrencias" :key="t.id">
		    <div class="content">
		      <div class="header">{{ t.nome }}</div>
		      <div class="meta">
		        <p>{{ dataHora(t.createdAt) }}</p>
		        <p v-if="t.dm">{{ t.dm.acceleration}} m/s</p>
		        <p v-if="t.dm">{{ t.dm.rotationRate}}</p>
		      </div>
		      <div class="description">
		        <select>
		          <option value="1">Natureza 1</option>
		          <option value="2">Natureza 2</option>
		        </select>
		      </div>
		      <div class="extra">
		        <button
		          @click="openPopup(t.recordUrl)"
		          v-if="t.recordUrl"
		          class="ui icon button red mini"
		          title="Gravação">
		          <i class="class icon video"></i>
		        </button>

		        <button
		          @click="openPopup(t.streamUrl)"
		          class="ui icon button mini"
		          title="Trasmissão ao vivo">
		          <i class="class icon wifi"></i>
		        </button>

		        <button
		          @click="marcarTrote(t)"
		          class="ui icon button secondary mini"
		          title="Marcar como trote">
		          <i class="class icon thumbs down"></i>
		        </button>

		        <button
		          @click="finalizar(t)"
		          class="ui icon button positive mini"
		          title="Finalizar ocorrência">
		          <i class="class icon check"></i>
		        </button>
		      </div>
		    </div>
	  	</div>
	</div>
</template>

<script>
	import moment from 'moment'
	import { naturezaPorId } from '../config/Helpers.ts'
	import { child, update } from 'firebase/database'
	import { ocorrenciaRef } from '../config/Firebase.ts'

	export default {
	  name: 'OcorrenciasComponent',
	  props: {
	  	ocorrencias: Array
	  },
	  methods: {
	  	nomeNatureza(id) {
	  	  return naturezaPorId(id).nome
	  	},
	  	dataHora(datetime) {
	  	  return moment(datetime).format('DD/MM HH:mm')
	  	},
	  	openPopup(link) {
	  	  const w = 400
	  	  const h = 450
	  	  const left = (screen.width - w) / 2
	  	  const top = (screen.height - h) / 4
	  	  window.open(link,'Ocorrência',`resizable=no,width=${w},height=${h}',top=${top},left=${left}`)
	  	},
	  	async marcarTrote(ocorrencia) {
	  		const ref = child(ocorrenciaRef, ocorrencia.id)
	  		await update(ref, { trote: true, active: false })
	  	},
	  	async finalizar(ocorrencia) {
	  		const ref = child(ocorrenciaRef, ocorrencia.id)
	  		await update(ref, { active: false })
	  	}
	  }
	}
</script>