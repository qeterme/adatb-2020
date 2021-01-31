<template>
  <nav
    class="navbar container is-light is-spaced"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.svg" height="28" />
      </a>
      <a
        role="button"
        class="navbar-burger burger is-hidden-print"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbar"
        v-on:click="isOpen = !isOpen"
        v-bind:class="{ 'is-active': isOpen }"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbar" class="navbar-menu" v-bind:class="{ 'is-active': isOpen }">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item" exact>Home</router-link>
        <router-link to="/inventory" class="navbar-item" v-if="currentUser">Készletállaptok</router-link>
        <router-link to="/products" class="navbar-item" v-if="currentUser">Termékek</router-link>
        <router-link to="/warehouses" class="navbar-item" v-if="currentUser && showAdmin">Raktárak</router-link>
        <router-link to="/projects" class="navbar-item" v-if="currentUser">Projektek</router-link>
        <router-link to="/categories" class="navbar-item" v-if="currentUser && !showAdmin">Kategóriák</router-link>
        <div class="navbar-item has-dropdown is-hoverable" v-if="showAdmin">
          <a class="navbar-link">Egyebek</a>
          <div class="navbar-dropdown">
            <router-link to="/categories" class="navbar-item">Kategóriák</router-link>
            <router-link to="/movements" class="navbar-item">Mozgások</router-link>
            <hr class="navbar-divider">
            <router-link to="/users" class="navbar-item">Felhasználók</router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link
              to="/login"
              class="button is-primary"
              v-if="!currentUser"
            >
              Bejelentkezés
            </router-link>
            <div class="field has-addons" v-else>
              <span class="control">
                <router-link 
                  to="/profile" 
                  class="button is-rounded is-primary"
                  title="Profiloldal"
                >
                  <span class="icon">
                    <font-awesome-icon
                      icon="user-astronaut"
                    ></font-awesome-icon>
                  </span>
                  <span>{{ currentUser.username }}</span>
                </router-link>
              </span>
              <span class="control">
                <button
                  class="button is-rounded is-outlined is-danger"
                  title="Kijelentkezés"
                  v-on:click="logOut()"
                >
                  <span class="icon">
                    <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                  </span>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const Auth = namespace("Auth");

@Component
export default class Nav extends Vue {
  isOpen: boolean = false;

  @Auth.State("user")
  private currentUser!: any;

  @Auth.Action
  private signOut!: () => void;

  get showAdmin(): boolean {
    if (this.currentUser && this.currentUser.roles) {
      return this.currentUser.roles.includes("ROLE_ADMIN");
    }

    return false;
  }

  logOut() {
    this.signOut();
    this.$router.push("/login");
  }
}
</script>
<style>
.navbar {
  margin-bottom: 1em;
}
</style>