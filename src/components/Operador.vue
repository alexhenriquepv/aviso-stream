<style>
  @import 'https://js.arcgis.com/4.20/esri/themes/light/main.css'
</style>

<template>
  <Layout>
    <div class="ui segment basic">
      <h4 class="ui header">Operador</h4>
      <div class="ui divider"></div>

      <div class="ui grid">

        <div class="twelve wide column">
          <div 
            class="ui segment" id="mapDiv" 
            style="padding:  0; margin:  0;height: 450px;width: 100%;"></div>
        </div>

        <div class="four wide column">
          <div class="ui items divided">
            <div class="item" v-for="t in transmissoes" :key="t.id">
              <div class="content">
                <div class="header">{{ t.nome }}</div>
                <div class="meta">
                  <span>{{ t.natureza || 'Evento não informado' }}</span>
                </div>
                <div class="description">
                  <p>{{ t.coords.lat }};{{ t.coords.lng }}</p>
                </div>
                <div class="extra">
                  <button class="ui button" @click="onOpen(t)">
                    Ver vídeo
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
      onOpen(transmissao) {
        const w = 400
        const h = 450
        const left = (screen.width - w) / 2
        const top = (screen.height - h) / 4
        window.open(
          `/stream/${transmissao.peerId}`, 
          'Ocorrência', 
          `resizable=no,width=${w},height=${h}',top=${top},left=${left}`
        )
      },
      createMap() {
        esriConfig.apiKey = "AAPKd1d9bd8c272d40d6bbbae45c0772a1d8H21FpNoaFDvMLPPugdSOXi5LBTlWAYQ0F-GBLSJI0Sgm_ks3JHw6q-01PsXu5xsQ"

        const map = new Map({
          basemap: 'arcgis-topographic'
        })

        new MapView({
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
              natureza: t.natureza,
              nome: t.nome,
            }
          })
        })
        
        const layer = new FeatureLayer({
          source: graphics,
          fields: [
            { name: 'id', alias: 'id', type: 'oid' },
            { name: 'peerId', alias: 'peerId', type: 'string' },
            { name: 'lat', alias: 'lat', type: 'string' },
            { name: 'lng', alias: 'lng', type: 'string' },
            { name: 'nome', alias: 'Nome', type: 'string' },
            { name: 'natureza', alias: 'Natureza', type: 'string' },
          ],
          renderer: {
            type: 'simple',
            symbol: {
              type: "picture-marker",
              url: './siren.png',
              width: "32px",
              height: "32px"
            },
          },
          popupTemplate: {
            title: "{nome}",
            content: "<a href='/stream/{peerId}'>Clique para ver a transmissão</a>"
          },
          objectIdField: 'id',
          geometryType: "point"
        })

        map.add(layer)
      }
    },
    mounted() {
      onValue(transmissaoRef, (snapshot) => {
        snapshot.forEach((child) => {
          let data = child.val()
          data.id = child.key
          this.transmissoes.push(data)
        })

        this.createMap()
      })
    }
  }
</script>
