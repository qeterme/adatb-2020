<template>
  <div class="categories">
    <Hero title="Kategóriák" subtitle="Mert mindent be lehet sorolni valahová..." />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ categories.length }}</strong> kategória
          </p>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Kategória keresése"
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
            <router-link to="/categories/new" class="button is-success control">
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
                <abbr name="Szülő kategória">Szülő kategória</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              :class="{ 'is-selected': index == currentIndex }"
              v-for="(category, index) in categories"
              :key="index"
              @click="setActiveCategory(category, index)"
            >
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.parentId }} - {{ category.parent }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-one-third">
        <div class="card">
          <div v-if="currentCategory">
            <div class="card-content">
              <p class="title">
                {{ currentCategory.name }}
              </p>
              <p class="subtitle">
                {{ currentCategory.parentId }} - {{ currentCategory.parent }}
              </p>
            </div>
            <footer class="card-footer">
              <router-link
                class="card-footer-item"
                :to="{
                  name: 'Kategória szerkesztése',
                  params: { id: String(currentCategory.id) },
                }"
              >
                Szerkesztés
              </router-link>
            </footer>
          </div>
          <div v-else class="card-content">
            <p>Kattints egy kategóriára!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import CategoryDataService from "@/services/CategoryDataService";
import { namespace } from "vuex-class";
const Auth = namespace("Auth");

@Component({
  components: {
    Hero,
  },
})
export default class Categories extends Vue {
  private categories: any[] = [];
  private currentCategory: any = null;
  private currentIndex: number = -1;
  private name: string = "";

@Auth.Action
  private signOut!: () => void;

  retrieveCategories() {
    CategoryDataService.getAll()
      .then((response) => {
        
        console.log("jó");
        this.categories = response.data;
        console.log(this.categories);
        this.categories.forEach(element => {
          console.log(element);
          if (element["parentId"]) {
            element["parent"] = this.categories.find(i => i.id === element["parentId"])["name"];
          }
        });
        this.$Progress.finish();
      })
      .catch((e) => {
        if (e.response.statusText == "Unauthorized") {
          this.signOut();
          this.$router.push("/login");
        }
        this.$Progress.fail();
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveCategories();
    this.currentCategory = null;
    this.currentIndex = -1;
    this.$Progress.finish();
  }

  setActiveCategory(category: any, index: number) {
    this.currentCategory = category;
    this.currentIndex = index;
  }

  searchName() {
    CategoryDataService.findByName(this.name)
      .then((response) => {
        this.categories = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  mounted() {
    this.retrieveCategories();
  }

  beforeMount() {
    this.$Progress.start();
  }

  goTo(index: number) {
    this.$router.push({
      name: "Kategória szerkesztése",
      params: { id: String(index) },
    });
  }
}
</script>