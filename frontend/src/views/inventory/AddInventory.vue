<template>
  <div>
    <Hero title="Új termék hozzáadása" />
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
            <label for="warehouse" class="label">Raktár</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="warehouse" v-model="inventory.warehouseId">
                <option
                  v-for="warehouse in warehouses"
                  v-bind:key="warehouse.id"
                  v-bind:value="warehouse.id"
                >
                  {{ warehouse.name }} - {{ warehouse.id }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="aisle" class="label">Sor</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="aisle"
              v-model="inventory.aisle"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="bin" class="label">Polc</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="bin"
              v-model="inventory.bin"
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
      <div class="notification is-success">Sikeres készlet hozzáadás!</div>
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
import WarehouseDataService from "@/services/WarehouseDataService";
import { Component, Vue } from "vue-property-decorator";
import InventoryDataService from "@/services/InventoryDataService";

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
    warehouseId: null,
    aisle: "",
    bin: "",
  };
  private products: any[] = [];
  private warehouses: any[] = [];
  private units: string[] = ["darab", "kilogramm", "liter", "méter"];

  private submitted: boolean = false;

  saveInventory() {
    this.$Progress.start();
    console.log(this.inventory);
    InventoryDataService.create(this.inventory)
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

  getWarehouses() {
    WarehouseDataService.getAll()
      .then((response) => {
        this.warehouses = response.data;
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
      warehouseId: null,
      aisle: "",
      bin: "",
    };
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.getProducts();
    this.getWarehouses();
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