
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

export { naturezaPorId, randomNatureza, randomNome }