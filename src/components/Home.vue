<template>
  <Layout>
    
    <div class="ui container">

      <div class="ui segment basic">
        <h3 class="ui header">
          Stream App
        </h3>
      </div>

      <div class="ui four stackable cards">
        
        <div class="ui card">
          <div class="content">
            <router-link to="/operador" class="header">Operador</router-link>
            <div class="description">
              <div class="ui placeholder">
                <div class="line"></div>
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
              <div class="ui placeholder">
                <div class="line"></div>
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
