<template>
  <div v-if="currentUser">
    <Hero :title="'#' + currentUser.id + ' - ' + currentUser.fullname" />
    <div v-if="currentUser">
      <div v-if="message != ''" class="notification is-success">
        {{ message }}
      </div>
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="fullname" class="label">Teljes név</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="fullname"
              v-model="currentUser.fullname"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="username" class="label">Felhasználónév</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="username"
              disabled
              v-model="currentUser.username"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="email" class="label">Email</label>
          </div>
          <div class="field-body">
            <input
              type="email"
              class="input"
              id="email"
              v-model="currentUser.email"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="role" class="label">Jogosultság</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="role" v-model="currentUser.roles[0]">
                <option
                  v-for="role in roles"
                  v-bind:key="role.id"
                  v-bind:value="role.id"
                >
                  {{ role.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="password" class="label">Jelszó</label>
          </div>
          <div class="field-body">
            <input
              type="password"
              class="input"
              id="password"
              v-model="currentUser.password"
            />
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button class="button is-danger is-outlined" @click="deleteUser">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="updateUser"
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
import { Component, Vue } from "vue-property-decorator";
import UserDataService from "@/services/UserDataService";
import RoleDataService from "@/services/RoleDataService";

@Component({
  components: {
    Hero,
  },
})
export default class User extends Vue {
  private currentUser: any = null;
  private roles: any[] = [];
  private message: string = "";

  getUser(id: string) {
    UserDataService.get(id)
      .then((response) => {
        this.currentUser = response.data;
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateUser() {
    this.$Progress.start();
    UserDataService.update(this.currentUser.id, this.currentUser)
      .then((response) => {
        console.log(response.data);
        this.message = "Felhasználó sikeresen frissítve!";
      })
      .catch((e) => {
        console.log(e);
      });
    this.$Progress.finish();
  }

  deleteUser() {
    UserDataService.delete(this.currentUser.id)
      .then((response) => {
        console.log(response.data);
        this.$router.push({ path: "users" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getRoles() {
    RoleDataService.getAll()
      .then((response) => {
        this.roles = response.data;
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
    this.getUser(this.$route.params.id);
    this.getRoles();
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