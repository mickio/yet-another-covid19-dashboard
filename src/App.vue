<template>
  <div id="app">
    <dashboard/>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Dashboard
  }
}
</script>

<style>
@import './assets/bulma.css'
</style>
