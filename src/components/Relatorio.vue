<template>
	<Layout>
		<div class="ui inverted segment center aligned" style="padding: .2rem 1rem;">
		  <div class="ui inverted secondary menu">
		    <router-link to="/" class="item">Início</router-link>
		    <a href="#" class="active item">
		      Relatório
		    </a>
		  </div>
		</div>

		<div class="ui segment basic">
			<table class="ui celled selectable striped table">
				<thead>
					<tr>
						<th>Data/Hora</th>
						<th>Natureza</th>
						<th>Nome</th>
						<th>Trote?</th>
						<th>Em andamento?</th>
						<th>#</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="o in ocorrencias" :key="o.id">
						<td>{{ dataHora(o.createdAt) }}</td>
						<td>{{ nomeNatureza(o.naturezaId) }}</td>
						<td>{{ o.nome }}</td>
						<td>{{ o.trote ? 'SIM' : 'NÃO' }}</td>
						<td>{{ o.active ? 'SIM' : 'NÃO' }}</td>
						<td>
							<button
							  @click="openPopup(o.recordUrl)"
							  v-if="o.recordUrl"
							  class="ui icon button red mini"
							  title="Gravação">
							  <i class="class icon video"></i>
							</button>

							<button
							  @click="openPopup(o.streamUrl)"
							  v-if="o.active"
							  class="ui icon button green mini"
							  title="Trasmissão ao vivo">
							  <i class="class icon wifi"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</Layout>
</template>

<script>
	import moment from 'moment'
	import Layout from '../Layout.vue'
	import { ocorrenciaRef } from '../config/Firebase.ts'
	import { onValue } from "firebase/database"
	import { naturezaPorId } from '../config/Helpers.ts'

  	export default {
	    name: 'Relatorio',
	    components: { Layout },
	    data() {
	      return {
	        ocorrencias: []
	      }
	    },
	    methods: {
	    	dataHora(datetime) {
	    	  return moment(datetime).format('DD/MM/YYYY HH:mm')
	    	},
	    	nomeNatureza(id) {
	    		return naturezaPorId(id).nome
	    	},
	    	openPopup(link) {
	    	  const w = 400
	    	  const h = 450
	    	  const left = (screen.width - w) / 2
	    	  const top = (screen.height - h) / 4
	    	  window.open(link,'Ocorrência',`resizable=no,width=${w},height=${h}',top=${top},left=${left}`)
	    	}
	    },
	    mounted() {
	      onValue(ocorrenciaRef, (snapshot) => {
	        this.ocorrencias = []
	        snapshot.forEach((child) => {
	          let data = child.val()
	          data.id = child.key
	          data.streamUrl = `${location.protocol}//${location.host}/stream/${data.peerId}`
	          this.ocorrencias.push(data)
	        })

	        this.ocorrencias.reverse()
	      })
	    }
  	}
</script>