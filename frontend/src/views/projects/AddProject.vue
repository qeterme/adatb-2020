<template>
  <div class="submit-form">
    <Hero title="Új projekt hozzáadása" />
    <div v-if="!submitted">
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="name" class="label">Név</label>
          </div>
          <div class="field-body">
            <input type="text" class="input" id="name" v-model="project.name" />
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
              v-model="project.address"
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
              v-model="project.description"
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
              v-model="project.discount"
            />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label for="role" class="label">Státusz</label>
          </div>
          <div class="field-body">
            <div class="select">
              <select id="status" v-model="project.status">
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
              <select multiple size="3" v-model="project.participants">
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
          <button type="submit" class="button is-success" @click="saveProject">
            Hozzáadás
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="notification is-success">Sikeres projekt hozzáadás!</div>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button type="submit" class="button is-success" @click="newProject">
            Új termék
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProjectDataService from "@/services/ProjectDataService";
import UserDataService from "@/services/UserDataService";
import Hero from "@/components/Hero.vue";

@Component({
  components: {
    Hero,
  },
})
export default class AddProject extends Vue {
  private users: any[] = [];
  private project: any = {
    id: null,
    name: "",
    address: "",
    description: "",
    discount: 0.0,
    status: "Elkezdve",
    participants: [],
  };

  private statuses: { [id: string]: { name: String } } = {};

  private submitted: boolean = false;

  saveProject() {
    this.$Progress.start();
    var data = {
      name: this.project.name,
      address: this.project.address,
      description: this.project.description,
      discount: this.project.discount / 100 + 1,
      status: this.project.status,
      participants: this.project.participants,
    };

    ProjectDataService.create(data)
      .then((response) => {
        this.project.id = response.data.id;
        console.log(response.data);
        this.submitted = true;
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
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

  newProject() {
    this.submitted = false;
    this.project = {
      id: null,
      name: "",
      address: "",
      description: "",
      discount: 0.0,
      status: "Elkezdve",
      participants: [],
    };
  }

  beforeMount() {
    this.$Progress.start();
  }

  mounted() {
    this.statuses[0] = { name: "Elkezdve" };
    this.statuses[1] = { name: "Folyamatban" };
    this.statuses[2] = { name: "Kész" };

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