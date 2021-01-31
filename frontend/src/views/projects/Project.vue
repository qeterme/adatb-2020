<template>
  <div class="inventories" v-if="project">
    <Hero
      :title="'#' + project.id + ' - ' + project.name"
      :subtitle="project.description + ' @ ' + project.address"
    />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ productCount }}</strong> termék lett felhasználva
          </p>
        </div>
      </div>

      <div class="level-right is-hidden-print">
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
              :to="{
                name: 'Új projektkészlet',
                params: {
                  id: String(project.id),
                },
              }"
              class="button is-success control"
              title="Új projektkészlet"
            >
              <span class="icon">
                <font-awesome-icon icon="plus"></font-awesome-icon>
              </span>
              <span>Új</span>
            </router-link>
          </span>
          <span class="control">
            <router-link
              :to="{
                name: 'Projekt szerkesztése',
                params: { id: String(project.id) },
              }"
              class="button is-info control"
              title="Projekt szerkesztése"
            >
              <span class="icon">
                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
              </span>
              <span>Szerkesztés</span>
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
                <abbr name="Felhasznált mennyiség">Felhasznált mennyiség</abbr>
              </th>
              <th>
                <abbr name="Egységár">Egységár</abbr>
              </th>
              <th>
                <abbr name="Áfa-kulcs">Áfa-kulcs</abbr>
              </th>
              <th>
                <abbr name="Nettó">Nettó</abbr>
              </th>
              <th>
                <abbr name="Bruttó">Bruttó</abbr>
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
              <td>
                {{
                  inventory.customPrice
                    ? inventory.customPrice
                    : inventory.product.price
                }}
                Ft
              </td>
              <td>{{ (inventory.product.vatrate - 1) * 100 }}%</td>
              <td>
                {{
                  (inventory.customPrice
                    ? inventory.customPrice
                    : inventory.product.price) * inventory.amount
                }}
                Ft
              </td>
              <td>
                {{
                  (inventory.customPrice
                    ? inventory.customPrice
                    : inventory.product.price) *
                  inventory.amount *
                  inventory.product.vatrate
                }}
                Ft
              </td>
              <td class="is-hidden-print">
                <router-link
                  :to="{
                    name: 'Projektkészlet szerkesztése',
                    params: { 
                      id: String(project.id),
                      invId: String(inventory.id)
                     },
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

    <nav class="level">
      <div class="level-left">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Résztvevők</p>
            <p class="title">
              <span
                v-for="user in project.users"
                v-bind:key="user.id"
                class="tag is-rounded is-info"
              >
                {{ user.fullname }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item has-text-centered" v-if="project.discount">
          <div>
            <p class="heading">Kedvezmény</p>
            <p class="title">{{ project.discount }}%</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Nettó végösszeg</p>
            <p class="title">{{ fullPriceexVat }} Ft</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Bruttó végösszeg</p>
            <p class="title">{{ fullPriceinclVat }} Ft</p>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import ProjectInventoryDataService from "@/services/ProjectInventoryDataService";
import ProjectDataService from "@/services/ProjectDataService";
import UserDataService from "@/services/UserDataService";
import { set } from "vue/types/umd";
import XLSX from "xlsx";

@Component({
  components: {
    Hero,
  },
})
export default class Project extends Vue {
  private project: any = null;
  private inventories: any[] = [];
  private productCount: number = 0;
  private fullPriceexVat: number = 0;
  private fullPriceinclVat: number = 0;

  retrieveInventories() {
    ProjectInventoryDataService.getAll(this.$route.params.id)
      .then((response) => {
        this.inventories = response.data;
        console.log(response.data);

        this.inventories.forEach((inventory) => {
          this.productCount += inventory.amount;
          this.fullPriceexVat +=
            (inventory.customPrice
              ? inventory.customPrice
              : inventory.product.price) * inventory.amount;
          this.fullPriceinclVat +=
            (inventory.customPrice
              ? inventory.customPrice
              : inventory.product.price) *
            inventory.amount *
            inventory.product.vatrate;
        });

        this.fullPriceexVat = Math.round(
          this.fullPriceexVat * (1 - this.project.discount / 100)
        );
        this.fullPriceinclVat = Math.round(
          this.fullPriceinclVat * (1 - this.project.discount / 100)
        );
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  getProject(id: string) {
    ProjectDataService.get(id)
      .then((response) => {
        console.log(response.data);
        this.project = response.data;
        this.project.discount = Math.round((this.project.discount - 1) * 100);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveInventories();
    this.$Progress.finish();
  }

  downloadXlsx() {
    var invs: any[] = JSON.parse(JSON.stringify(this.inventories));

    invs.forEach(element => {
      delete element.id;
      delete element.createdAt;
      delete element.updatedAt;
      delete element.productId;
      delete element.projectId;
      element.price = element.customPrice ? element.customPrice : element.product.price;
      delete element.customPrice;
      element.vatrate = element.product.vatrate;
      element.product = element.product.name;
      element.priceexVat = element.price * element.amount;
      element.priceinclVat = (element.price * element.amount) * element.vatrate;
    });

    var inventoriesWS = XLSX.utils.json_to_sheet(invs);

    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, inventoriesWS, "Keszletek");
    XLSX.writeFile(wb, "projekt-" + this.$route.params.id + ".xlsx");
  }

  mounted() {
    this.getProject(this.$route.params.id);
    this.retrieveInventories();
  }

  beforeMount() {
    this.$Progress.start();
  }
}
</script>
<style>
.tag {
  margin-bottom: 0.2em;
  margin-right: 0.2em;
}
</style>