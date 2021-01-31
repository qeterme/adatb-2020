<template>
  <div class="warehouses">
    <Hero
      title="Raktárak"
      subtitle="Kis raktár, nagy raktár, a tartalma itt van!"
    />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ warehouses.length }}</strong> raktár
          </p>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Raktár keresése"
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

      <div class="level-right">
        <p class="level-item field has-addons">
          <span class="control">
            <router-link to="/warehouses/new" class="button is-success control">
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
                <abbr name="ID">ID</abbr>
              </th>
              <th>
                <abbr name="Név">Név</abbr>
              </th>
              <th>
                <abbr name="Helyszín">Helyszín</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              :class="{ 'is-selected': index == currentIndex }"
              v-for="(warehouse, index) in warehouses"
              :key="index"
              @click="setActiveWarehouse(warehouse, index)"
            >
              <td>{{ warehouse.id }}</td>
              <td>{{ warehouse.name }}</td>
              <td>{{ warehouse.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-one-third">
        <div class="card">
          <div v-if="currentWarehouse">
            <div class="card-content">
              <p class="title">
                {{ currentWarehouse.name }}
              </p>
              <p class="subtitle">
                {{ currentWarehouse.address }}
              </p>
            </div>
            <footer class="card-footer">
              <router-link
                class="card-footer-item"
                :to="{
                  name: 'Raktár szerkesztése',
                  params: { id: String(currentWarehouse.id) },
                }"
              >
                Szerkesztés
              </router-link>
            </footer>
          </div>
          <div v-else class="card-content">
            <p>Kattints egy raktárra!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import WarehouseDataService from "@/services/WarehouseDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Warehouses extends Vue {
  private warehouses: any[] = [];
  private currentWarehouse: any = null;
  private currentIndex: number = -1;
  private name: string = "";

  retrieveWarehouses() {
    WarehouseDataService.getAll()
      .then((response) => {
        this.warehouses = response.data;
        console.log(response.data);
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveWarehouses();
    this.currentWarehouse = null;
    this.currentIndex = -1;
    this.$Progress.finish();
  }

  setActiveWarehouse(warehouse: any, index: number) {
    this.currentWarehouse = warehouse;
    this.currentIndex = index;
  }

  removeAllWarehouses() {
    WarehouseDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchName() {
    WarehouseDataService.findByName(this.name)
      .then((response) => {
        this.warehouses = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  mounted() {
    this.retrieveWarehouses();
  }

  beforeMount() {
    this.$Progress.start();
  }
}
</script>