<template>
  <div id="login">
    <div class="hero is-fullheight is-light">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-4 is-offset-4">
            <img src="../assets/logo.svg" id="register-logo"/>
            <div class="box">
              <h1 class="title has-text-grey">Regisztráció</h1>
              <p class="subtitle has-text-grey">
                Folytatáshoz kérlek regisztrálj be!
              </p>
              <div
                v-if="message"
                class="notification"
                :class="successful ? 'is-success' : 'is-danger'"
              >
                {{ message }}
              </div>
              <form name="form" @submit.prevent="handleRegister">
                <div class="field">
                  <div class="control">
                    <input
                      v-model="user.username"
                      v-validate="'required|min:3|max:20'"
                      type="text"
                      class="input"
                      name="username"
                      placeholder="Felhasználónév"
                      autofocus
                    />
                  </div>
                </div>
                <div
                  v-if="submitted && errors.has('username')"
                  class="notification is-danger is-light"
                >
                  Felhasználónév kötelező!
                </div>
                <div class="field">
                  <div class="control">
                    <input
                      v-model="user.email"
                      v-validate="'required|email|max:50'"
                      type="email"
                      class="input"
                      name="email"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div
                  v-if="submitted && errors.has('email')"
                  class="notification is-danger is-light"
                >
                  Email kötelező!
                  {{ errors.first("email") }}
                </div>
                <div class="field">
                  <div class="control">
                    <input
                      v-model="user.password"
                      v-validate="'required|min:6|max:40'"
                      type="password"
                      class="input"
                      name="password"
                      placeholder="Jelszó"
                    />
                  </div>
                </div>
                <div
                  v-if="submitted && errors.has('password')"
                  class="notification is-danger is-light"
                >
                  Jelszó kötelező!
                </div>
                <button class="button is-block is-primary">Regisztráció</button>
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
export default class Register extends Vue {
  private user: any = { username: "", email: "", password: "" };

  private submitted: boolean = false;
  private successful: boolean = false;
  private message: string = "";

  @Auth.Getter
  private isLoggedIn!: boolean;

  @Auth.Action
  private register!: (data: any) => Promise<any>;

  mounted() {
    if (this.isLoggedIn) {
      this.$router.push("/profile");
    }
  }

  handleRegister() {
    this.message = "";
    this.submitted = true;

    this.$validator.validate().then((isValid) => {
      if (isValid) {
        this.register(this.user).then(
          (data) => {
            this.message = data.message;
            this.successful = true;
          },
          (error) => {
            this.message = error;
            this.successful = false;
          }
        );
      }
    });
  }
}
</script>
<style>
#register-logo {
  margin-bottom: 1rem;
}
</style>