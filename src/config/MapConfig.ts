import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"
import esriConfig from "@arcgis/core/config"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
import Graphic from "@arcgis/core/Graphic"
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery"
import LayerList from "@arcgis/core/widgets/LayerList"
import Search from "@arcgis/core/widgets/Search"
import Expand from "@arcgis/core/widgets/Expand"
import Locator from "@arcgis/core/tasks/Locator"

import CustomLayers from './CustomLayers.ts'
import { naturezaPorId, randomCoord } from './Helpers.ts'

esriConfig.apiKey = "AAPKd1d9bd8c272d40d6bbbae45c0772a1d8H21FpNoaFDvMLPPugdSOXi5LBTlWAYQ0F-GBLSJI0Sgm_ks3JHw6q-01PsXu5xsQ"

let map, view, ocorrenciasLayer, viaturasLayer, delegaciasLayer

function setUpMap(divName) {
	map = new Map({ basemap: 'arcgis-topographic' })
	view = new MapView({
		map: map,
		center: [-59.988311, -3.056085],
		zoom: 13,
		container: divName
	})

	ocorrenciasLayer = new GraphicsLayer(CustomLayers.ocorrencias.config)
	map.add(ocorrenciasLayer)

	viaturasLayer = new GraphicsLayer(CustomLayers.viaturas.config)
	map.add(viaturasLayer)

	delegaciasLayer = new GraphicsLayer(CustomLayers.delegacias.config)
	map.add(delegaciasLayer)

	const transitoLayer = new MapImageLayer(CustomLayers.transito.config)
	map.add(transitoLayer)

	const searchWidget = new Search({ view: view })
	view.ui.add(searchWidget, { position: 'top-right' })

	const basemapGallery = new BasemapGallery({ view: view })
	const bgExpand = new Expand({ view: view, content: basemapGallery })
	view.ui.add(bgExpand, "bottom-left")

	const layerList = new LayerList({ view: view })
	const listExpand = new Expand({ view: view, content: layerList })
	view.ui.add(listExpand, "bottom-left")

	const locatorTask = new Locator({
		url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
	})

	view.on('double-click', async(e) => {

	  e.stopPropagation()
	  const lat = Math.round(e.mapPoint.latitude * 1000) / 1000
	  const lng = Math.round(e.mapPoint.longitude * 1000) / 1000

	  view.popup.open({
	    title: `Coordenadas [${lng}, ${lat}]`,
	    location: e.mapPoint
	  })

	  try {
	    const res = await locatorTask.locationToAddress({ location: e.mapPoint })
	    view.popup.content = res.address
	  }
	  catch(err) {
	    console.log('Fail to find location', err)
	    view.popup.content = "Endereço não encontrado"
	  }
	})

	setViaturas()
	setDelegacias()
}

function setViaturas() {
	const graphics = []
	for (let i = 0; i < 15; i++) {
		const coord = randomCoord()
		const item = new Graphic({
			geometry: {
			  type: 'point',
			  longitude: coord.lng,
			  latitude: coord.lat
			},
			symbol: CustomLayers.viaturas.symbol
		})

		graphics.push(item)
	}
	viaturasLayer.addMany(graphics)
}

function setDelegacias() {
	const graphics = []
	for (let i = 0; i < 6; i++) {
		const coord = randomCoord()
		const item = new Graphic({
			geometry: {
			  type: 'point',
			  longitude: coord.lng,
			  latitude: coord.lat
			},
			symbol: CustomLayers.delegacias.symbol
		})

		graphics.push(item)
	}
	delegaciasLayer.addMany(graphics)
}

function addToOcorrenciasLayer(items) {
	const graphics = items
	.filter(t => t.coords)
	.map(t => {
	  	return new Graphic({
		    geometry: {
		      type: 'point',
		      longitude: t.coords.lng,
		      latitude: t.coords.lat
		    },
		    symbol: CustomLayers.ocorrencias.symbol,
		    popupTemplate: CustomLayers.ocorrencias.popupTemplate,
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
	
	ocorrenciasLayer.removeAll()
	ocorrenciasLayer.addMany(graphics)
}

export {
	map, view, addToOcorrenciasLayer, setUpMap
}