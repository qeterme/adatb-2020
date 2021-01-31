<template>
  <div class="submit-form">
    <Hero title="Új kategória hozzáadása" />
    <div v-if="!submitted">
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Név</label>
          </div>
          <div class="field-body">
            <input type="text" class="input" id="name" v-model="category.name" />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="category" class="label">Kategória</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="category" v-model="category.parentId">
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
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button type="submit" class="button is-success" @click="saveCategory">
            Hozzáadás
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="notification is-success">Sikeres kategória hozzáadás!</div>
      <div class="field is-grouped is-grouped-right">
      <p class="control">
          <button type="submit" class="button is-success" @click="newCategory">
            Új kategória
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CategoryDataService from "@/services/CategoryDataService";
import Hero from "@/components/Hero.vue";

@Component({
  components: {
    Hero,
  },
})
export default class AddCategory extends Vue {
  private categories: any[] = [];
  private category: any = {
    id: null,
    name: "",
    parentId: null,
  };

  private submitted: boolean = false;

  saveCategory() {
    this.$Progress.start();
    var data = {
      name: this.category.name,
      parentId: this.category.parentId,
    };

    CategoryDataService.create(data)
      .then((response) => {
        this.category.id = response.data.id;
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

  newCategory() {
    this.submitted = false;
    this.category = {
      id: null,
      name: "",
      parentId: null,
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