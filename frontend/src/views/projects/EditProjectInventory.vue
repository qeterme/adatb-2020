<template>
  <div v-if="currentInventory">
    <Hero :title="'Készlet #' + $route.params.id + '-' + currentInventory.id" />
    <div v-if="currentInventory">
      <div v-if="message != ''" class="notification is-success">
        {{ message }}
      </div>
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="product" class="label">Termék</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="product" v-model="currentInventory.productId">
                <option
                  v-for="product in products"
                  v-bind:key="product.id"
                  v-bind:value="product.id"
                >
                  {{ product.name }} - {{ product.id }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="amount" class="label">Mennyiség</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="amount"
              v-model="currentInventory.amount"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="unit" class="label">Egység</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="unit" v-model="currentInventory.unit">
                <option
                  v-for="unit in units"
                  v-bind:key="unit"
                  v-bind:value="unit"
                >
                  {{ unit }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="customPrice" class="label">Egyedi ár</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="customPrice"
              v-model="currentInventory.customPrice"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button class="button is-danger is-outlined" @click="deleteInventory">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="updateInventory"
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
import ProductDataService from "@/services/ProductDataService";
import { Component, Vue } from "vue-property-decorator";
import ProjectInventoryDataService from "@/services/ProjectInventoryDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Inventory extends Vue {
  private currentInventory: any = null;
  private products: any[] = [];
  private warehouses: any[] = [];
  private message: string = "";
  private units: string[] = ["darab", "kilogramm", "liter", "méter", "óra"];

  getInventory(id: string) {
    ProjectInventoryDataService.get(this.$route.params.id, id)
      .then((response) => {
        this.currentInventory = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateInventory() {
    this.$Progress.start();
    ProjectInventoryDataService.update(
      this.$route.params.id,
      this.currentInventory.id,
      this.currentInventory
    )
      .then((response) => {
        console.log(response.data);
        this.message = "Készlet sikeresen frissítve!";
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  deleteInventory() {
    ProjectInventoryDataService.delete(
      this.$route.params.id,
      this.currentInventory.id
    )
      .then((response) => {
        console.log(response.data);
        this.$router.push({
          name: "Készletállapotok",
          params: { id: String(this.$route.params.id) },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getProducts() {
    ProductDataService.getAll()
      .then((response) => {
        this.products = response.data;
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
    this.getInventory(this.$route.params.invId);
    this.getProducts();
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