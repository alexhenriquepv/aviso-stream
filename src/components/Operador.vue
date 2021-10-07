<style>
  @import 'https://js.arcgis.com/4.20/esri/themes/light/main.css'
</style>

<template>
  <Layout>
    <div class="ui inverted segment center aligned">
      <div class="ui inverted secondary menu">
        <a href="#" class="active item">
          Operador
        </a>
      </div>
    </div>

    <div class="ui segment basic">
      <div class="ui grid">

        <!-- list -->
        <div class="three wide column">
          <div class="ui items divided">
            <div class="item" v-for="t in ocorrencias" :key="t.id">

              <div class="ui red label right corner">
                <i class="video icon"></i>
              </div>

              <div class="content">
                <div class="header">{{ t.nome }}</div>
                <div class="meta">
                  <span>{{ nomeNatureza(t.naturezaId) }}</span>
                </div>
                <div class="description">
                  <p>{{ t.createdAt }}</p>
                  <p v-if="t.coords">{{ t.coords.lat }} {{ t.coords.lng }}</p>
                  <p v-if="t.dm">{{ t.dm.acceleration}} m/s</p>
                  <p v-if="t.dm">{{ t.dm.rotationRate}}</p>
                </div>
                <div class="extra">
                  <button class="ui button secondary mini" @click="onOpen(t)">
                    Ver transmissão
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- list -->

        <!-- map -->
        <div class="thirteen wide column">
          <div id="mapDiv" style="padding:  0; margin:  0;height: 530px;width: 100%;"></div>
        </div>
        <!-- map -->
      </div>

    </div>
  </Layout>
</template>

<script>

  import Layout from '../Layout.vue'
  import { ocorrenciaRef } from '../config/Firebase.ts'
  import { naturezaPorId } from '../config/NaturezaEvento.ts'

  import { view, addToOcorrenciasLayer, setUpMap } from '../config/MapConfig.ts'

  import { onValue } from "firebase/database"

  export default {
    name: 'Operador',
    components: { Layout },
    data() {
      return {
        mapConfig: null,
        publicPath: process.env.BASE_URL,
        ocorrencias: []
      }
    },
    methods: {
      nomeNatureza(id) {
        return naturezaPorId(id).nome
      },
      onOpen(ocorrencia) {
        this.openPopup(ocorrencia.streamUrl)
      },
      openPopup(link) {
        const w = 400
        const h = 450
        const left = (screen.width - w) / 2
        const top = (screen.height - h) / 4
        window.open(link,'Ocorrência',`resizable=no,width=${w},height=${h}',top=${top},left=${left}`)
      },
      createMap() {

        setUpMap('mapDiv')

        view.popup.on("trigger-action", (e) => {
          if (e.action.id == 'transmissao') {
            const atts = view.popup.viewModel.selectedFeature.attributes
            this.openPopup(atts.streamUrl)
          }
        })
      }
    },
    mounted() {
      this.createMap()
      console.log('mounted')
      onValue(ocorrenciaRef, (snapshot) => {
        this.ocorrencias = []
        snapshot.forEach((child) => {
          let data = child.val()
          data.id = child.key
          data.streamUrl = `${location.protocol}//${location.host}/stream/${data.peerId}`
          this.ocorrencias.push(data)
        })

        addToOcorrenciasLayer(this.ocorrencias)
      })
    }
  }
</script>
