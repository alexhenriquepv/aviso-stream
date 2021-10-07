
const naturezas = [
	{ id: 1, nome: "Incêndio" },
	{ id: 2, nome: "Desastre Natural" },
	{ id: 3, nome: "Assalto em coletivo" },
	{ id: 4, nome: "Sequestro" },
	{ id: 5, nome: "Briga de vizinho" },
	{ id: 6, nome: "Linchamento" },
	{ id: 7, nome: "Acidênte de trânsito" },
	{ id: 8, nome: "Explosão" },
	{ id: 9, nome: "Pessoa descontrolada" },
	{ id: 10, nome: "Não identificada" }
]

const nomes = [
	"João", "Maria", "Felipe", "Marcela", "Draco",
	"Patrick", "Enzo", "Letícia", "Werley", "Yamuri"
]

const coordenadas = [
	{ lat: -3.026607, lng: -59.938347 },
	{ lat: -3.023259, lng: -59.954109 },
	{ lat: -3.022625, lng: -59.977901 },
	{ lat: -3.018661, lng: -59.968770 },
	{ lat: -3.026950, lng: -59.988835 },
	{ lat: -3.021539, lng: -59.999969 },
	{ lat: -3.008336, lng: -60.007231 },
	{ lat: -3.055526, lng: -60.030893 },
	{ lat: -3.078795, lng: -60.046026 },
	{ lat: -3.098128, lng: -60.067179 },
	{ lat: -3.109536, lng: -60.047193 },
	{ lat: -3.111383, lng: -60.041178 },
	{ lat: -3.111059, lng: -60.034258 },
	{ lat: -3.109664, lng: -59.978987 },
	{ lat: -3.115690, lng: -59.962886 },
	{ lat: -3.085236, lng: -59.892866 }
]

const naturezaPorId = (id) => {
	for (let i = 0; i < naturezas.length; i++) {
		if (naturezas[i].id == id) {
			return naturezas[i]
		}
	}

	return naturezas[naturezas.length - 1]
}

const randomNatureza = () => {
	const index = Math.floor((Math.random() * naturezas.length) + 1)
	return naturezas[index]
}

const randomNome = () => {
	const index = Math.floor((Math.random() * nomes.length) + 1)
	return nomes[index]
}

const randomCoord = () => {
	const index = Math.floor((Math.random() * coordenadas.length) + 1)
	return coordenadas[index]
}

export { naturezaPorId, randomNatureza, randomNome, randomCoord }