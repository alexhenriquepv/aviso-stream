<template>
  <Layout>
    <p>
      <router-link to="/operador">Operador</router-link>
    </p>
    <p>
      <router-link to="/cidadao">Cidadão</router-link>
    </p>
  </Layout>
</template>

<script>
  import Layout from '../Layout.vue'

  export default {
    name: 'Home',
    components: { Layout }
  }
</script>
