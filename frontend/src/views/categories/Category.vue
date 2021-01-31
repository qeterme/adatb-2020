<template>
  <div v-if="currentCategory">
    <Hero :title="'#' + currentCategory.id + ' - ' + currentCategory.name" />
    <div v-if="currentCategory">
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
              v-model="currentCategory.name"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="category" class="label">Szülő kategória</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="category" v-model="currentCategory.parentId">
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
          <button class="button is-danger is-outlined" @click="deleteCategory">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="updateCategory"
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

@Component({
  components: {
    Hero,
  },
})
export default class Category extends Vue {
  private currentCategory: any = null;
  private categories: any[] = [];
  private message: string = "";

  getCategory(id: string) {
    CategoryDataService.get(id)
      .then((response) => {
        this.currentCategory = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateCategory() {
    this.$Progress.start();
    CategoryDataService.update(this.currentCategory.id, this.currentCategory)
      .then((response) => {
        console.log(response.data);
        this.message = "Kategória sikeresen frissítve!";
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  deleteCategory() {
    CategoryDataService.delete(this.currentCategory.id)
      .then((response) => {
        console.log(response.data);
        this.$router.push({ name: "Kategóriák" });
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
    this.getCategory(this.$route.params.id);
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