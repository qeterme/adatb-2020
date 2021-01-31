<template>
    <Hero title="Erőforrás nem található!" subtitle="Hibakód: 404" error/>
</template>
<script>
import Hero from "@/components/Hero.vue";
export default {
  name: "notFound",
  components: {
    Hero,
  },
};
</script>