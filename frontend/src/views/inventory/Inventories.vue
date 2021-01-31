<template>
  <div class="inventories">
    <Hero title="Készletállapotok" subtitle="Jelenlegi készletek" />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ productCount }}</strong> termék van raktáron
          </p>
        </div>
      </div>

      <div class="level-right">
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
            <router-link
              to="/inventory/new"
              class="button is-success control"
            >
              <span class="icon">
                <font-awesome-icon icon="plus"></font-awesome-icon>
              </span>
              <span>Új</span>
            </router-link>
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
                <abbr name="Terméknév">Terméknév</abbr>
              </th>
              <th>
                <abbr name="Készletinformáció">Készletinformáció</abbr>
              </th>
              <th>
                <abbr name="Raktár">Raktár</abbr>
              </th>
              <th>
                <abbr name="Sor">Sor</abbr>
              </th>
              <th>
                <abbr name="Polc">Polc</abbr>
              </th>
              <th class="is-hidden-print">
                <abbr name="Műveletek"></abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              v-for="(inventory, index) in inventories"
              :key="index"
            >
              <td>{{ inventory.product.name }}</td>
              <td>{{ inventory.amount }} {{ inventory.unit }}</td>
              <td>{{ inventory.warehouse.name }}</td>
              <td>
                <span class="tag is-danger">{{ inventory.aisle }}</span>
              </td>
              <td>
                <span class="tag is-danger">{{ inventory.bin }}</span>
              </td>
              <td class="is-hidden-print">
                <router-link
                  :to="{
                    name: 'Készlet szerkesztése',
                    params: { id: String(inventory.id) },
                  }"
                  class="button is-success is-small is-light is-outlined is-rounded"
                  title="Szerkesztés"
                >
                  <span class="icon">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  </span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import InventoryDataService from "@/services/InventoryDataService";
import { set } from "vue/types/umd";
import XLSX from "xlsx";

@Component({
  components: {
    Hero,
  },
})
export default class Inventories extends Vue {
  private inventories: any[] = [];
  private productCount: number = 0;

  retrieveInventories() {
    InventoryDataService.getAll()
      .then((response) => {
        this.inventories = response.data;
        console.log(response.data);

        this.inventories.forEach((inventory) => {
          this.productCount += inventory.amount;
        });
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveInventories();
    this.$Progress.finish();
  }

  downloadXlsx() {
    var invs:any[] = JSON.parse(JSON.stringify(this.inventories));
    
    invs.forEach(element => {
      delete element.createdAt;
      delete element.updatedAt;
      delete element.productId;
      delete element.warehouseId;
      element.product = element.product.name;
      element.warehouse = element.warehouse.name;
    });
    
    var inventoriesWS = XLSX.utils.json_to_sheet(invs);

    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, inventoriesWS, "Keszletek");
    XLSX.writeFile(wb, "keszletek.xlsx");
  }

  mounted() {
    this.retrieveInventories();
  }

  beforeMount() {
    this.$Progress.start();
  }
}
</script>