<template>
  <div class="products">
    <Hero
      title="Áruk"
      subtitle="A termékek listája. Hozzáadhatsz újat, törölheted vagy megnézheted merre találhatóak"
    />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ products.length }}</strong> termék
          </p>
        </div>
        <div class="level-item is-hidden-print">
          <div class="field has-addons">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Termék keresése"
                v-model="name"
              />
            </p>
            <p class="control">
              <button type="submit" class="button" @click="searchName">
                Keresés
              </button>
            </p>
          </div>
        </div>
      </div>

      <div class="level-right is-hidden-print">
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 0 }"
            v-on:click="searchStatus('Összes')"
          >
            Összes</a
          >
        </p>
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 1 }"
            v-on:click="searchStatus('Raktáron')"
          >
            Raktáron</a
          >
        </p>
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 2 }"
            v-on:click="searchStatus('Nincs készleten')"
          >
            Nincs készleten</a
          >
        </p>
        <p class="level-item field has-addons">
          <span class="control">
            <button 
              class="button is-link is-light control" 
              v-on:click="downloadXlsx()" 
              title="XLSX letöltése"
            >
              <span class="icon">
                <font-awesome-icon icon="file-excel"></font-awesome-icon>
              </span>
              <span>Letöltés</span>
            </button>
          </span>
          <span class="control">
            <router-link to="/products/new" class="button is-success control">
              <span class="icon">
                <font-awesome-icon icon="plus"></font-awesome-icon>
              </span>
              <span>Új</span>
            </router-link>
          </span>
          <span class="control">
            <button
              class="button is-danger is-outlined"
              @click="removeAllProducts"
            >
              <span class="icon">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </span>
              <span>Összes törlése</span>
            </button>
          </span>
        </p>
      </div>
    </nav>

    <div class="columns">
      <div class="column highlight-full">
        <table class="table is-hoverable is-striped is-fullwidth">
          <thead>
            <tr>
              <th>
                <abbr name="ID">ID</abbr>
              </th>
              <th>
                <abbr name="Név">Név</abbr>
              </th>
              <th>
                <abbr name="Nettó ár">Nettó</abbr>
              </th>
              <th>
                <abbr name="Bruttó ár">Bruttó</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              :class="{ 'is-selected': index == currentIndex }"
              v-for="(product, index) in products"
              :key="index"
              @click="setActiveProduct(product, index)"
            >
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.price }} Ft</td>
              <td>{{ product.price * product.vatrate }} Ft</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-one-third is-hidden-print">
        <div class="card">
          <div v-if="currentProduct">
            <div class="card-content">
              <p class="title">
                {{ currentProduct.name }}
              </p>
              <p class="subtitle">
                {{ currentProduct.price * currentProduct.vatrate }} Ft
                <small
                  ><small
                    >({{ currentProduct.price }} Ft +
                    {{ Math.round((currentProduct.vatrate - 1) * 100) }}%
                    Áfa)</small
                  ></small
                >
              </p>
              <p>
                {{ currentProduct.description }}<br />

                <label><strong>Kategória:</strong></label>
                <span v-if="currentProduct.categoryId">
                  {{ currentProduct.category.id }} -
                  {{ currentProduct.category.name }}
                  <small v-if="currentProduct.category.parent != ''"
                    >{{ currentProduct.category.parent.id }} -
                    {{ currentProduct.category.parent.name }}</small
                  ><br />
                </span>
                <span v-else> -<br /> </span>

                <label><strong>Gyártói azonosító:</strong></label>
                {{ currentProduct.manufacturerId }}<br />

                <label><strong>Vonalkód:</strong></label>
                {{ currentProduct.barcode }}<br />

                <label 
                  v-if="currentProduct.inventories.length > 0"
                >
                  <strong>Készletinformációk:</strong>
                </label>
                <ul>
                  <li 
                    v-for="inventory in currentProduct.inventories"
                    v-bind:key="inventory.id"
                  >
                    <span class="tag is-dark is-medium">Raktár #{{ inventory.warehouseId }}</span>
                    <span class="tag is-danger is-rounded">{{ inventory.aisle }}</span> 
                    <span class="tag is-danger is-rounded">{{ inventory.bin }}</span> 
                    <span>{{ inventory.amount }} {{ inventory.unit }}</span>
                  </li>
                </ul>
              </p>
            </div>
            <footer class="card-footer">
              <router-link
                class="card-footer-item"
                :to="{
                  name: 'Termék szerkesztése',
                  params: { id: String(currentProduct.id) },
                }"
              >
                Szerkesztés
              </router-link>
            </footer>
          </div>
          <div v-else class="card-content">
            <p>Kattints egy termékre!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import ProductDataService from "@/services/ProductDataService";
import CategoryDataService from "@/services/CategoryDataService";
import { set } from "vue/types/umd";
import XLSX from "xlsx";
import Warehouse from "../warehouses/Warehouse.vue";

@Component({
  components: {
    Hero,
  },
})
export default class Products extends Vue {
  private products: any[] = [];
  private ogProducts: any[] = [];
  private currentProduct: any = null;
  private currentIndex: number = -1;
  private name: string = "";
  private selectedStatus: number = 0;

  retrieveProducts() {
    ProductDataService.getAll()
      .then((response) => {
        this.products = response.data;
        console.log(response.data);
        this.ogProducts = JSON.parse(JSON.stringify(this.products));
        this.setCategories();
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveProducts();
    this.currentProduct = null;
    this.currentIndex = -1;
    this.$Progress.finish();
  }

  setCategories() {
    this.ogProducts.forEach((element) => {
      if (element.categoryId) {
        CategoryDataService.get(element.categoryId).then((response2) => {
          element.category = response2.data;
          CategoryDataService.get(response2.data.parentId).then((response3) => {
            element.category.parent = response3.data;
          });
        });
      }
    });
    this.products.forEach((element) => {
      if (element.categoryId) {
        CategoryDataService.get(element.categoryId).then((response2) => {
          element.category = response2.data;
          CategoryDataService.get(response2.data.parentId).then((response3) => {
            element.category.parent = response3.data;
          });
        });
      }
    });
  }

  setActiveProduct(product: any, index: number) {
    this.currentProduct = product;
    this.currentIndex = index;
  }

  removeAllProducts() {
    ProductDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchName() {
    ProductDataService.findByName(this.name)
      .then((response) => {
        this.products = response.data;
        console.log(response.data);
        this.setCategories();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchStatus(status: string) {
    this.$Progress.start();
    switch (status) {
      case "Összes": {
        this.selectedStatus = 0;
        this.products = this.ogProducts;
        this.$Progress.finish();
        break;
      }
      case "Raktáron": {
        this.selectedStatus = 1;
        this.products = [];
        this.ogProducts.forEach((element) => {
          if (element.inventories.length > 0) {
            this.products.push(element);
          }
        });
        this.$Progress.finish();
        break;
      }
      case "Nincs készleten": {
        this.selectedStatus = 2;
        this.products = [];
        this.ogProducts.forEach((element) => {
          if (element.inventories.length == 0) {
            this.products.push(element);
          }
        });
        this.$Progress.finish();
        break;
      }
    }
  }

  downloadXlsx() {
    var prods: any[] = JSON.parse(JSON.stringify(this.products));

    prods.forEach((element) => {
      delete element.createdAt;
      delete element.updatedAt;
      delete element.categoryId;
      element.category = element.category ? element.category.name : "";
    });

    var productsWS = XLSX.utils.json_to_sheet(prods);

    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, productsWS, "Termekek");
    XLSX.writeFile(wb, "termekek.xlsx");
  }

  mounted() {
    this.retrieveProducts();
  }

  beforeMount() {
    this.$Progress.start();
  }

  goTo(index: number) {
    this.$router.push({
      name: "Termék szerkesztése",
      params: { id: String(index) },
    });
  }
}
</script>
<style>
.bold {
  color: #363636;
  font-weight: 700;
}
.tag {
  margin-bottom: 0.2em;
  margin-right: 0.2em;
}
</style>