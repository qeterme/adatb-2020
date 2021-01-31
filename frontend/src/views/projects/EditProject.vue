<template>
  <div v-if="currentProject">
    <Hero :title="'#' + currentProject.id + ' - ' + currentProject.name" />
    <div v-if="currentProject">
      <div v-if="message != ''" class="notification is-success">
        {{ message }}
      </div>
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Teljes név</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="name"
              v-model="currentProject.name"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="address" class="label">Helyszín</label>
          </div>
          <div class="field-body">
            <input
              type="text"
              class="input"
              id="address"
              v-model="currentProject.address"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="description" class="label">Leírás</label>
          </div>
          <div class="field-body">
            <textarea
              class="textarea"
              id="description"
              v-model="currentProject.description"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="discount" class="label">Kedvezmény (%-ban)</label>
          </div>
          <div class="field-body">
            <input
              type="number"
              class="input"
              id="discount"
              v-model="currentProject.discount"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="role" class="label">Státusz</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="status" v-model="currentProject.status">
                <option
                  v-for="stat in statuses"
                  v-bind:key="stat.name"
                  v-bind:value="stat.name"
                >
                  {{ stat.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="participants" class="label">Résztvevők</label>
          </div>
          <div class="field-body">
            <div class="select is-multiple">
              <select multiple size="3" v-model="currentProject.participants">
                <option
                  v-for="user in users"
                  v-bind:key="user.id"
                  v-bind:value="user.id"
                >
                  {{ user.fullname }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button class="button is-danger is-outlined" @click="deleteProject">
            Törlés
          </button>
        </p>
        <p class="control">
          <button
            type="submit"
            class="button is-success"
            @click="updateProject"
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
import ProjectDataService from "@/services/ProjectDataService";
import UserDataService from "@/services/UserDataService";

@Component({
  components: {
    Hero,
  },
})
export default class EditProject extends Vue {
  private currentProject: any = null;
  private users: any[] = [];
  private message: string = "";

  private statuses: { [id: number]: { name: String } } = {};

  getProject(id: string) {
    ProjectDataService.getForEdit(id)
      .then((response) => {
        console.log(response.data);
        this.currentProject = response.data;
        this.currentProject.discount = Math.round(
          (this.currentProject.discount - 1) * 100
        );
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateProject() {
    this.$Progress.start();
    this.currentProject.discount = this.currentProject.discount / 100 + 1;
    console.log(this.currentProject);
    ProjectDataService.update(this.currentProject.id, this.currentProject)
      .then((response) => {
        console.log(response.data);
        this.message = "Projekt sikeresen frissítve!";
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
    this.currentProject.discount = Math.round(
      (this.currentProject.discount - 1) * 100
    );
  }

  deleteProject() {
    ProjectDataService.delete(this.currentProject.id)
      .then((response) => {
        console.log(response.data);
        this.$router.push({ name: "Projektek" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getUsers() {
    UserDataService.getAll()
      .then((response) => {
        this.users = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.statuses[0] = { name: "Elkezdve" };
    this.statuses[1] = { name: "Folyamatban" };
    this.statuses[2] = { name: "Kész" };

    this.message = "";
    this.getProject(this.$route.params.id);
    this.getUsers();
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