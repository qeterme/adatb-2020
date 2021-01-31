<template>
  <div v-if="currentWarehouse">
    <Hero :title="'#' + currentWarehouse.id + ' - ' + currentWarehouse.name" />
    <div v-if="currentWarehouse">
      <div v-if="message != ''" class="notification is-success">
        {{ message }}
      </div>
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Név</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="name"
              v-model="currentWarehouse.name"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="address" class="label">Helyszín</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="address"
              v-model="currentWarehouse.address"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button class="button is-danger is-outlined" v-on:click="deleteWarehouse">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            v-on:click="updateWarehouse"
          >
            Mentés
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Hero from "@/components/Hero.vue";
import CategoryDataService from "@/services/CategoryDataService";
import { Component, Vue } from "vue-property-decorator";
import WarehouseDataService from "@/services/WarehouseDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Warehouse extends Vue {
  private currentWarehouse: any = null;
  private categories: any[] = [];
  private message: string = "";

  getWarehouse(id: string) {
    WarehouseDataService.get(id)
      .then((response) => {
        this.currentWarehouse = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateWarehouse() {
    this.$Progress.start();
    WarehouseDataService.update(this.currentWarehouse.id, this.currentWarehouse)
      .then((response) => {
        console.log(response.data);
        this.message = "Raktár sikeresen frissítve!";
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  deleteWarehouse() {
    WarehouseDataService.delete(this.currentWarehouse.id)
      .then((response) => {
        console.log(response.data);
        this.$router.push({name:"Raktárak"});
      })
      .catch((e) => {
        console.log(e);
      });
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.message = "";
    this.getWarehouse(this.$route.params.id);
    this.$Progress.finish();
  }
}
</script>

<style scoped>
form {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.notification {
  margin-top: 1rem;
}
</style>