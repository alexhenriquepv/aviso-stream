<style>
  @import 'https://js.arcgis.com/4.20/esri/themes/light/main.css'
</style>

<template>
  <Layout>
    <div class="ui inverted segment center aligned" style="padding: .2rem 1rem;">
      <div class="ui inverted secondary menu">
        <router-link to="/" class="item">Início</router-link>
        <a href="#" class="active item">
          Operador
        </a>
      </div>
    </div>

    <div class="ui segment basic">
      <div class="ui grid">

        <!-- list -->
        <div class="three wide column" style="padding-top: 0; padding-bottom: 0;">
          <OcorrenciasComponent :ocorrencias="ocorrencias"></OcorrenciasComponent>
        </div>
        <!-- list -->

        <!-- map -->
        <div class="thirteen wide column" style="padding-top: 0; padding-bottom: 0; padding-left: 0;">
          <div id="mapDiv" style="padding:  0; margin:  0;height: 530px;width: 100%;"></div>
        </div>
        <!-- map -->

      </div>

    </div>
  </Layout>
</template>

<script>

  import Layout from '../Layout.vue'
  import OcorrenciasComponent from './OcorrenciasComponent.vue'
  import { ocorrenciaRef } from '../config/Firebase.ts'
  import { view, addToOcorrenciasLayer, setUpMap } from '../config/MapConfig.ts'
  import { onValue } from "firebase/database"
  
  export default {
    name: 'Operador',
    components: { Layout, OcorrenciasComponent },
    data() {
      return {
        mapConfig: null,
        ocorrencias: []
      }
    },
    methods: {
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

      onValue(ocorrenciaRef, (snapshot) => {
        this.ocorrencias = []
        snapshot.forEach((child) => {

          let data = child.val()
          
          if (data.active && !data.trote) {
            data.id = child.key
            data.streamUrl = `${location.protocol}//${location.host}/stream/${data.peerId}`
            this.ocorrencias.push(data)
          }
        })

        this.ocorrencias.reverse()
        addToOcorrenciasLayer(this.ocorrencias)
      })
    }
  }
</script>
