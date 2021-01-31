<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <section>
      <div v-if="$route.path != '/login' && $route.path != '/register'">
        <div class="container">
          <Nav />
          <router-view />
        </div>
      </div>
      <div v-if="$route.path == '/login' || $route.path == '/register'">
        <router-view />
      </div>
    </section>    
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";
export default {
  name: "app",
  components: {
    Nav,
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.level {
  padding: 1em;
}
@media print {
  .is-hidden-print {
    display: none !important;
  }
}
</style>
