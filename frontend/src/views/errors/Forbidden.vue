<template>
    <Hero title="Erőforrás nem elérhető!" subtitle="Hibakód: 403" error/>
</template>
<script>
import Hero from "@/components/Hero.vue";
export default {
  name: "forbidden",
  components: {
    Hero,
  },
};
</script>