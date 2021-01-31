<template>
  <section class="hero" v-bind:class="{'is-primary': !error, 'is-danger': error}">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">{{title}}</h1>
        <h2 class="subtitle">{{subtitle}}</h2>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "Hero",
  props: {
    title: String,
    subtitle: String,
    error: Boolean,
  },
};
</script>