<template>
  <div class="profile" v-if="currentUser">
    <Hero
      :title="'Szia ' + currentUser.username + '!'"
      subtitle="Ez itt a profiloldal."
    />
    <div v-if="message != ''" class="notification is-success">
      {{ message }}
    </div>
    <div class="form">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label for="id" class="label">ID</label>
        </div>
        <div class="field-body">
          <input
            type="text"
            class="input"
            id="id"
            v-model="currentUser.id"
            disabled
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
            v-model="currentUser.username"
            disabled
          />
        </div>
      </div>
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
            disabled
          />
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label for="email" class="label">Email</label>
        </div>
        <div class="field-body">
          <input
            type="text"
            class="input"
            id="email"
            v-model="currentUser.email"
            disabled
          />
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label for="roles" class="label">Rang</label>
        </div>
        <div class="field-body">
          <input
            type="text"
            class="input"
            id="roles"
            v-model="currentUser.roles"
            disabled
          />
        </div>
      </div>
      <form>
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

        <div class="field is-grouped is-grouped-right">
          <p class="control">
            <button type="submit" class="button is-success" @click="updateUser">
              Mentés
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import UserDataService from "@/services/UserDataService";
const Auth = namespace("Auth");

@Component({
  components: {
    Hero,
  },
})
export default class Profile extends Vue {
  @Auth.State("user")
  private currentUser!: any;

  private message: string = "";

  updateUser() {
    this.$Progress.start();
    UserDataService.updateSelf(this.currentUser.id, this.currentUser)
      .then((response) => {
        console.log(response.data);
        this.message = "Jelszó sikeresen frissítve!";
      })
      .catch((e) => {
        console.log(e);
      });
    this.$Progress.finish();
  }

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  }
}
</script>
<style scoped>
.form {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
form {
  padding-bottom: 1rem;
}
.notification {
  margin-top: 1rem;
}
</style>