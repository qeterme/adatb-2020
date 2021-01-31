<template>
  <div class="users">
    <Hero title="Felhasználók" />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ users.length }}</strong> felhasználó
          </p>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Felhasználó keresése"
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
            <router-link to="/users/new" class="button is-success control">
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
                <abbr name="Teljes név">Teljes név</abbr>
              </th>
              <th>
                <abbr name="Felhasználónév">Felhasználónév</abbr>
              </th>
              <th>
                <abbr name="Email">Email</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              :class="{ 'is-selected': index == currentIndex }"
              v-for="(user, index) in users"
              :key="index"
              @click="setActiveUser(user, index)"
            >
              <td>{{ user.id }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-one-third">
        <div class="card">
          <div v-if="currentUser">
            <div class="card-content">
              <p class="title">
                {{ currentUser.fullname }}
              </p>
              <p class="subtitle">
                {{ currentUser.username }}
              </p>
              <p>
                {{ currentUser.email }}
              </p>
            </div>
            <footer class="card-footer">
              <router-link
                class="card-footer-item"
                :to="{
                  name: 'Felhasználó szerkesztése',
                  params: { id: String(currentUser.id) },
                }"
              >
                Szerkesztés
              </router-link>
            </footer>
          </div>
          <div v-else class="card-content">
            <p>Kattints egy felhasználóra!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import UserDataService from "@/services/UserDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Users extends Vue {
  private users: any[] = [];
  private currentUser: any = null;
  private currentIndex: number = -1;
  private name: string = "";

  retrieveUsers() {
    UserDataService.getAll()
      .then((response) => {
        this.users = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
    this.$Progress.finish();
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveUsers();
    this.currentUser = null;
    this.currentIndex = -1;
    this.$Progress.finish();
  }

  setActiveUser(user: any, index: number) {
    this.currentUser = user;
    this.currentIndex = index;
  }

  searchName() {
    UserDataService.findByName(this.name)
      .then((response) => {
        this.users = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  mounted() {
    this.retrieveUsers();
  }

  beforeMount() {
    this.$Progress.start();
  }

  goTo(index: number) {
    this.$router.push({
      name: "Felhasználó szerkesztése",
      params: { id: String(index) },
    });
  }
}
</script>