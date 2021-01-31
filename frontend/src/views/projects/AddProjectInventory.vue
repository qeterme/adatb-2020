<template>
  <div>
    <Hero title="Új projektkészlet hozzáadása" />
    <div v-if="!submitted">
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="product" class="label">Termék</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="product" v-model="inventory.productId">
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
              v-model="inventory.amount"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="unit" class="label">Egység</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="unit" v-model="inventory.unit">
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
              v-model="inventory.customPrice"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="saveInventory"
          >
            Hozzáadás
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="notification is-success">Sikeres projektkészlet hozzáadás!</div>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button type="submit" class="button is-success" @click="newInventory">
            Új készlet
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
export default class AddInventory extends Vue {
  private inventory: any = {
    id: null,
    productId: null,
    amount: 1,
    unit: "darab",
    customPrice: "",
  };
  private products: any[] = [];
  private warehouses: any[] = [];
  private units: string[] = ["darab", "kilogramm", "liter", "méter", "óra"];

  private submitted: boolean = false;

  saveInventory() {
    this.$Progress.start();
    console.log(this.inventory);
    ProjectInventoryDataService.create(this.$route.params.id, this.inventory)
      .then((response) => {
        this.inventory.id = response.data.id;
        console.log(response.data);
        this.submitted = true;
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
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

  newInventory() {
    this.submitted = false;
    this.inventory = {
      id: null,
      productId: null,
      amount: 1,
      unit: "darab",
      customPrice: ""
    };
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
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