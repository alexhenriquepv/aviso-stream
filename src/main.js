import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import HomeComponent from './components/Home.vue'
import OperadorComponent from './components/Operador.vue'
import CidadaoComponent from './components/Cidadao.vue'
import StreamComponent from './components/Stream.vue'

const NotFoundComponent = { template: '<p>Página não encontrada</p>' }

const routes = [
	{ path: '/', component: HomeComponent },
	{ path: '/operador', component: OperadorComponent },
	{ path: '/cidadao', component: CidadaoComponent },
	{ path: '/stream/:peerId', component: StreamComponent },
	{ path: '/:pathMatch(.*)*', component: NotFoundComponent },
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

createApp(App).use(router).mount('#app')