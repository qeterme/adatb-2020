<template>
  <div class="submit-form">
    <Hero title="Új raktár hozzáadása" />
    <div v-if="!submitted">
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Név</label>
          </div>
          <div class="field-body">
            <input type="text" class="input" id="name" v-model="warehouse.name" />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="address" class="label">Helyszín</label>
          </div>
          <div class="field-body">
            <input type="text" class="input" id="address" v-model="warehouse.address" />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button type="submit" class="button is-success" @click="saveWarehouse">
            Hozzáadás
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="notification is-success">Sikeres raktár hozzáadás!</div>
      <div class="field is-grouped is-grouped-right">
      <p class="control">
          <button type="submit" class="button is-success" @click="newWarehouse">
            Új raktár
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WarehouseDataService from "@/services/WarehouseDataService";
import CategoryDataService from "@/services/CategoryDataService";
import Hero from "@/components/Hero.vue";

@Component({
  components: {
    Hero,
  },
})
export default class AddWarehouse extends Vue {
  private categories: any[] = [];
  private warehouse: any = {
    id: null,
    name: "",
    address: ""
  };

  private submitted: boolean = false;

  saveWarehouse() {
    this.$Progress.start();
    var data = {
      name: this.warehouse.name,
      address: this.warehouse.address,
    };

    WarehouseDataService.create(data)
      .then((response) => {
        this.warehouse.id = response.data.id;
        console.log(response.data);
        this.submitted = true;
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }


  newWarehouse() {
    this.submitted = false;
    this.warehouse = {
      id: null,
      name: "",
      address: "",
    };
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
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