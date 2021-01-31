<template>
  <div class="submit-form">
    <Hero title="Új felhasználó hozzáadása" />
    <div>
      <div
        v-if="message"
        class="notification"
        :class="successful ? 'is-success' : 'is-danger'"
      >
        {{ message }}
      </div>
      <form name="form" @submit.prevent="handleRegister">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="username" class="label">Felhasználónév</label>
          </div>
          <div class="field-body">
            <input
              v-model="user.username"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="input"
              name="username"
              placeholder="Felhasználónév"
            />
          </div>
        </div>
        <div
          v-if="submitted && errors.has('username')"
          class="notification is-danger is-light"
        >
          Felhasználónév kötelező!
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="fullname" class="label">Teljes név</label>
          </div>
          <div class="field-body">
            <input
              v-model="user.fullname"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="input"
              name="fullname"
              placeholder="Teljes név"
            />
          </div>
        </div>
        <div
          v-if="submitted && errors.has('fullname')"
          class="notification is-danger is-light"
        >
          Teljes név kötelező!
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="email" class="label">Email</label>
          </div>
          <div class="field-body">
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
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="password" class="label">Jelszó</label>
          </div>
          <div class="field-body">
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
        <div class="field is-grouped is-grouped-right">
          <p class="control">
            <button class="button is-success">Hozzáadás</button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const Auth = namespace("Auth");
import Hero from "@/components/Hero.vue";

@Component({
  components: {
    Hero,
  },
})
export default class AddUser extends Vue {
  private user: any = { username: "", fullname: "", email: "", password: "" };

  private submitted: boolean = false;
  private successful: boolean = false;
  private message: string = "";

  @Auth.Action
  private register!: (data: any) => Promise<any>;

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
form {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.notification {
  margin-top: 1rem;
}
</style>