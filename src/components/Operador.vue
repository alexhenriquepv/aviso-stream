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

        <div class="twelve wide column">
          <div 
            class="ui segment" id="mapDiv" 
            style="padding:  0; margin:  0;height: 450px;width: 100%;"></div>
        </div>

        <div class="four wide column">
          <div class="ui items divided">
            <div class="item" v-for="t in transmissoes" :key="t.id">

              <div class="ui red label right corner">
                <i class="video icon"></i>
              </div>

              <div class="content">
                <div class="header">{{ t.nome }}</div>
                <div class="meta">
                  <span>{{ nomeNatureza(t.naturezaId) }}</span>
                </div>
                <div class="description">
                  <p>{{ t.coords.lat }} {{ t.coords.lng }}</p>
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
      </div>

    </div>
  </Layout>
</template>

<script>

  import Layout from '../Layout.vue'
  import { transmissaoRef } from '../config/Firebase.ts'
  import { naturezaPorId } from '../config/NaturezaEvento.ts'
  import { operadorLayer } from '../config/CustomLayer.ts'
  import { onValue } from "firebase/database"

  import Map from "@arcgis/core/Map"
  import MapView from "@arcgis/core/views/MapView"
  import esriConfig from "@arcgis/core/config"
  import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
  import Graphic from "@arcgis/core/Graphic"

  export default {
    name: 'Operador',
    components: { Layout },
    data() {
      return {
        publicPath: process.env.BASE_URL,
        transmissoes: []
      }
    },
    methods: {
      nomeNatureza(id) {
        return naturezaPorId(id).nome
      },
      onOpen(transmissao) {
        this.openPopup(transmissao.streamUrl)
      },
      openPopup(link) {
        const w = 400
        const h = 450
        const left = (screen.width - w) / 2
        const top = (screen.height - h) / 4
        window.open(link,'Ocorrência',`resizable=no,width=${w},height=${h}',top=${top},left=${left}`)
      },
      createMap() {
        esriConfig.apiKey = "AAPKd1d9bd8c272d40d6bbbae45c0772a1d8H21FpNoaFDvMLPPugdSOXi5LBTlWAYQ0F-GBLSJI0Sgm_ks3JHw6q-01PsXu5xsQ"

        const map = new Map({ basemap: 'arcgis-topographic' })

        const view = new MapView({
          map: map,
          center: [-59.988311, -3.056085],
          zoom: 13,
          container: 'mapDiv'
        })

        const graphics = this.transmissoes.map(t => {
          return new Graphic({
            geometry: {
              type: 'point',
              longitude: t.coords.lng,
              latitude: t.coords.lat
            },
            attributes: {
              peerId: t.peerId,
              streamUrl: t.streamUrl,
              natureza: naturezaPorId(t.naturezaId).nome,
              nome: t.nome,
              celular: t.celular,
              lat: t.coords.lat,
              lng: t.coords.lng,
            }
          })
        })
        
        operadorLayer.source = graphics
        const layer = new FeatureLayer(operadorLayer)
        map.add(layer)

        view.popup.on("trigger-action", (e) => {
          if (e.action.id == 'transmissao') {
            const atts = view.popup.viewModel.selectedFeature.attributes
            this.openPopup(atts.streamUrl)
          }
        })
      }
    },
    mounted() {
      onValue(transmissaoRef, (snapshot) => {
        snapshot.forEach((child) => {
          let data = child.val()
          data.id = child.key
          data.streamUrl = `${location.protocol}//${location.host}/stream/${data.peerId}?naturezaId=${data.naturezaId}`
          this.transmissoes.push(data)
        })

        this.createMap()
      })
    }
  }
</script>
