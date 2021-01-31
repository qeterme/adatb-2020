<template>
  <div id="login">
    <div class="hero is-fullheight is-light">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-4 is-offset-4">
            <img src="../assets/logo.svg" id="login-logo"/>
            <div class="box">
              <h1 class="title has-text-grey">Bejelentkezés</h1>
              <p class="subtitle has-text-grey">
                Folytatáshoz kérlek jelentkezz be!
              </p>
              <div v-if="message" class="notification is-danger">
                {{ message }}
              </div>
              <form name="form" @submit.prevent="handleLogin">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Felhasználónév"
                      v-model="user.username"
                      v-validate="'required'"
                      name="username"
                      autofocus
                    />
                  </div>
                </div>
                <div
                  v-if="errors.has('username')"
                  class="notification is-danger is-light"
                >
                  Felhasználónév kötelező!
                </div>
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="password"
                      v-model="user.password"
                      v-validate="'required'"
                      placeholder="Jelszó"
                      name="password"
                    />
                  </div>
                </div>
                <div
                  v-if="errors.has('password')"
                  class="notification is-danger is-light"
                >
                  Jelszó kötelező!
                </div>
                <button class="button is-block is-primary" :disabled="loading" v-bind:class="{'is-loading': loading}">
                  Belépés
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const Auth = namespace("Auth");

@Component
export default class Login extends Vue {
  private user: any = { username: "", password: "" };
  private loading: boolean = false;
  private message: string = "";

  @Auth.Getter
  private isLoggedIn!: boolean;

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  created() {
    if (this.isLoggedIn) {
      this.$router.push("/profile");
    }
  }

  handleLogin() {
    this.loading = true;
    this.$validator.validateAll().then((isValid) => {
      if (!isValid) {
        this.loading = false;
        return;
      }

      if (this.user.username && this.user.password) {
        this.login(this.user).then(
          (data) => {
            this.$router.push("/profile");
          },
          (error) => {
            this.loading = false;
            this.message = error;
          }
        );
      }
    });
  }
}
</script>
<style>
#login-logo {
  margin-bottom: 1rem;
}
</style>