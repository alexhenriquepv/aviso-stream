import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import HomeComponent from './components/Home.vue'
import OperadorComponent from './components/Operador.vue'
import CidadaoComponent from './components/Cidadao.vue'
import StreamComponent from './components/Stream.vue'
import RelatorioComponent from './components/Relatorio.vue'

const NotFoundComponent = { template: '<p>Página não encontrada</p>' }

const routes = [
	{ path: '/', component: HomeComponent, meta: { title: 'Home' } },
	{ path: '/operador', component: OperadorComponent, meta: { title: 'Operador' } },
	{ path: '/cidadao', component: CidadaoComponent, meta: { title: 'Cidadão' } },
	{ path: '/relatorio', component: RelatorioComponent, meta: { title: 'Relatório' } },
	{ path: '/stream/:peerId', component: StreamComponent, meta: { title: 'Transmissão' } },
	{ path: '/:pathMatch(.*)*', component: NotFoundComponent, meta: { title: '404 Not Found' } },
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to) => {
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
	if(nearestWithTitle) {
		document.title = nearestWithTitle.meta.title
	}
})

createApp(App).use(router).mount('#app')