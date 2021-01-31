<template>
  <div class="submit-form">
    <Hero title="Új termék hozzáadása" />
    <div v-if="!submitted">
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Név</label>
          </div>
          <div class="field-body">
            <input type="text" class="input" id="name" v-model="product.name" />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="price" class="label">Nettó ár</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="price"
              v-model="product.price"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="vatrate" class="label">Áfa (%-ban)</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="vatrate"
              v-model="product.vatrate"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="barcode" class="label">Vonalkód</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="barcode"
              v-model="product.barcode"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="manu_id" class="label">Gyártói azonosító</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="manu_id"
              v-model="product.manufacturerId"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="category" class="label">Kategória</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="category" v-model="product.categoryId">
                <option
                  v-for="category in categories"
                  v-bind:key="category.id"
                  v-bind:value="category.id"
                >
                  {{ category.name }} - {{ category.id }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="description" class="label">Leírás</label>
          </div>
          <div class="field-body">
            <textarea
              class="textarea"
              id="description"
              v-model="product.description"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button type="submit" class="button is-success" @click="saveProduct">
            Hozzáadás
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="notification is-success">Sikeres termék feltöltés!</div>
      <div class="field is-grouped is-grouped-right">
      <p class="control">
          <button type="submit" class="button is-success" @click="newProduct">
            Új termék
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProductDataService from "@/services/ProductDataService";
import CategoryDataService from "@/services/CategoryDataService";
import Hero from "@/components/Hero.vue";

@Component({
  components: {
    Hero,
  },
})
export default class AddProduct extends Vue {
  private categories: any[] = [];
  private product: any = {
    id: null,
    name: "",
    price: 0,
    vatrate: 27,
    barcode: "",
    manufacturerId: "",
    categoryId: null,
    description: "",
  };

  private submitted: boolean = false;

  saveProduct() {
    this.$Progress.start();
    var data = {
      name: this.product.name,
      price: this.product.price,
      vatrate: this.product.vatrate / 100 + 1,
      barcode: this.product.barcode,
      manufacturerId: this.product.manufacturerId,
      categoryId: this.product.categoryId,
      description: this.product.description,
    };

    ProductDataService.create(data)
      .then((response) => {
        this.product.id = response.data.id;
        console.log(response.data);
        this.submitted = true;
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  getCategories() {
    CategoryDataService.getAll()
      .then((response) => {
        this.categories = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newProduct() {
    this.submitted = false;
    this.product = {
      id: null,
      name: "",
      price: 0,
      vatrate: 27,
      barcode: "",
      manufacturerId: "",
      categoryId: null,
      description: "",
    };
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.getCategories();
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