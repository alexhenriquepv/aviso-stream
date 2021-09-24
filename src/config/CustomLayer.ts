const operadorLayer = {
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
	renderer: {
		type: 'simple',
		symbol: { type: "picture-marker", url: './siren.png', width: "32px", height: "32px" },
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
	objectIdField: 'id',
	geometryType: "point"
}

export { operadorLayer }