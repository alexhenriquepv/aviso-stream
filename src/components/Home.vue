<template>
  <Layout>
    
    <div class="ui container">

      <div class="ui segment basic">
        <h3 class="ui header">
          Aviso Stream
        </h3>
      </div>

      <div class="ui four stackable cards">
        
        <div class="ui card">
          <div class="content">
            <router-link to="/operador" class="header">Operador</router-link>
            <div class="description">
              <p>Painel de ocorrências em tempo real</p>
              <div class="ui placeholder">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="ui card">
          <div class="content">
            <router-link to="/cidadao" class="header">Cidadão</router-link>
            <div class="description">
              <p>App Cidadão versão Web</p>
              <div class="ui placeholder">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="ui card">
          <div class="content">
            <router-link to="/relatorio" class="header">Relatório</router-link>
            <div class="description">
              <p>Informações das ocorrências</p>
              <div class="ui placeholder">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
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

  export default {
    name: 'Home',
    components: { Layout }
  }
</script>
