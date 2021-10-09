const CustomLayers = {
	ocorrencias: {
		config: {
			id: 'ocorrencias-layer',
			title: "Ocorrências",
			graphics: [],
			fields: [
				{ name: 'id', type: 'oid' },
				{ name: 'peerId', type: 'string' },
				{ name: 'streamUrl', type: 'string' },
				{ name: 'lat', type: 'string', valueType: 'coordinate' },
				{ name: 'lng', type: 'string', valueType: 'coordinate' },
				{ name: 'nome', type: 'string', valueType: 'name-or-title' },
				{ name: 'natureza', type: 'string', valueType: 'type-or-category' },
				{ name: 'celular', type: 'string' },
			],
			objectIdField: 'id',
			geometryType: "point"
		},
		popupTemplate: {
			title: "{natureza}",
			actions: [
				{
					id: 'transmissao',
					className: 'esri-icon-play',
					title: 'Ver transmissão'
				}
			],
			expressionInfos: [
				{
					name: 'coordenadas', 
					title: 'Coordenadas', 
					expression: "$feature.lat + '  ' + $feature.lng"
				},
				{
					name: 'stream-url', 
					title: 'Link', 
					expression: "$feature.streamUrl"
				}
			],
			content: [
				{
					type: 'fields',
					fieldInfos: [
						{ fieldName: 'nome', label: 'Solicitante' },
						{ fieldName: 'celular', label: 'Celular' },
						{ fieldName: 'expression/coordenadas' },
						{ fieldName: 'expression/stream-url' },
					]
				}
			]
		},
		symbol: { type: "picture-marker", url: './siren.png', width: "32px", height: "32px" },
	},
	transito: {
		config: {
			title: "Trânsito",
			visible: false,
			url: "http://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer",
			sublayers: [{ id: 14, title: 'Tempo Real', visible: true }]
		}
	},
	viaturas: {
		config: {
			id: 'viaturas-layer',
			title: 'Viaturas',
			graphics: [],
			fields: [],
			geometryType: "point"
		},
		symbol: { type: "picture-marker", url: './police-car.png', width: "32px", height: "32px" },
	},
	delegacias: {
		config: {
			id: 'delegacias-layer',
			title: 'Delegacias',
			graphics: [],
			fields: [],
			geometryType: "point"
		},
		symbol: { type: "picture-marker", url: './police-station.png', width: "32px", height: "32px" },
	}
}

export default CustomLayers