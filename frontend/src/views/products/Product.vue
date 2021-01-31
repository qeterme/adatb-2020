<template>
  <div v-if="currentProduct">
    <Hero :title="'#' + currentProduct.id + ' - ' + currentProduct.name" />
    <div v-if="currentProduct">
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
              v-model="currentProduct.name"
            />
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
              v-model="currentProduct.price"
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
              v-model="currentProduct.vatrate"
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
              v-model="currentProduct.barcode"
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
              v-model="currentProduct.manufacturerId"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="category" class="label">Kategória</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="category" v-model="currentProduct.categoryId">
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
              v-model="currentProduct.description"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button class="button is-danger is-outlined" @click="deleteProduct">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="updateProduct"
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
import ProductDataService from "@/services/ProductDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Product extends Vue {
  private currentProduct: any = null;
  private categories: any[] = [];
  private message: string = "";

  getProduct(id: string) {
    ProductDataService.get(id)
      .then((response) => {
        this.currentProduct = response.data;
        this.currentProduct.vatrate = Math.round(
          (this.currentProduct.vatrate - 1) * 100
        );
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateProduct() {
    this.$Progress.start();
    this.currentProduct.vatrate = this.currentProduct.vatrate / 100 + 1;
    ProductDataService.update(this.currentProduct.id, this.currentProduct)
      .then((response) => {
        console.log(response.data);
        this.message = "Termék sikeresen frissítve!";
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
    this.currentProduct.vatrate = Math.round(
      (this.currentProduct.vatrate - 1) * 100
    );
  }

  deleteProduct() {
    ProductDataService.delete(this.currentProduct.id)
      .then((response) => {
        console.log(response.data);
        this.$router.push({ name: "Termékek" });
      })
      .catch((e) => {
        console.log(e);
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

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.message = "";
    this.getProduct(this.$route.params.id);
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