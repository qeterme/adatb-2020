<template>
  <div class="projects">
    <Hero
      title="Projektek"
      subtitle="Készíts egy új projektet vagy módosíts egyet!"
    />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ projects.length }}</strong> projekt
          </p>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Projekt keresése"
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
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 0 }"
            v-on:click="searchStatus('Összes')"
          >
            Összes</a
          >
        </p>
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 1 }"
            v-on:click="searchStatus('Folyamatban')"
          >
            Folyamatban</a
          >
        </p>
        <p class="level-item">
          <a
            v-bind:class="{ bold: selectedStatus == 2 }"
            v-on:click="searchStatus('Kész')"
          >
            Kész</a
          >
        </p>
        <p class="level-item field has-addons">
          <span class="control">
            <router-link to="/projects/new" class="button is-success control">
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
                <abbr name="Helyszín">Helyszín</abbr>
              </th>
              <th>
                <abbr name="Státusz">Státusz</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              :class="{ 'is-selected': index == currentIndex }"
              v-for="(project, index) in projects"
              :key="index"
              @click="setActiveProject(project, index)"
            >
              <td>{{ project.id }}</td>
              <td>{{ project.name }}</td>
              <td>{{ project.address }}</td>
              <td>{{ project.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-one-third">
        <div class="card">
          <div v-if="currentProject">
            <div class="card-content">
              <p class="title">
                {{ currentProject.name }}
              </p>
              <p class="subtitle">
                {{ currentProject.address }}
              </p>
              <label><strong>Státusz:</strong></label>
              {{ currentProject.status }}
              <p>
                <label><strong>Résztvevők: </strong></label>
                <span
                  v-for="user in currentProject.users"
                  v-bind:key="user.id"
                  class="tag is-rounded is-info"
                >
                  {{ user.fullname }}
                </span>
              </p>
            </div>
            <footer class="card-footer">
              <router-link
                class="card-footer-item"
                :to="{
                  name: 'Projekt',
                  params: { id: String(currentProject.id) },
                }"
              >
                Részletek
              </router-link>
            </footer>
          </div>
          <div v-else class="card-content">
            <p>Kattints egy raktárra!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import ProjectDataService from "@/services/ProjectDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Projects extends Vue {
  private projects: any[] = [];
  private currentProject: any = null;
  private currentIndex: number = -1;
  private name: string = "";
  private selectedStatus: number = 0;

  retrieveProjects() {
    ProjectDataService.getAll()
      .then((response) => {
        this.projects = response.data;
        console.log(response.data);
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  refreshList() {
    this.$Progress.start();
    this.retrieveProjects();
    this.currentProject = null;
    this.currentIndex = -1;
    this.$Progress.finish();
  }

  setActiveProject(project: any, index: number) {
    this.currentProject = project;
    this.currentIndex = index;
  }

  removeAllProjects() {
    ProjectDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchName() {
    this.$Progress.start();
    this.selectedStatus = 0;

    ProjectDataService.findByName(this.name)
      .then((response) => {
        this.projects = response.data;
        console.log(response.data);
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  searchStatus(status: string) {
    this.$Progress.start();
    switch (status) {
      case "Összes": {
        status = "";
        this.selectedStatus = 0;
        break;
      }
      case "Folyamatban": {
        this.selectedStatus = 1;
        break;
      }
      case "Kész": {
        this.selectedStatus = 2;
        break;
      }
    }

    ProjectDataService.findByStatus(status)
      .then((response) => {
        this.projects = response.data;
        console.log(response.data);
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  mounted() {
    this.retrieveProjects();
  }

  beforeMount() {
    this.$Progress.start();
  }
}
</script>
<style>
.bold {
  color: #363636;
  font-weight: 700;
}
.tag {
  margin-bottom: 0.2em;
  margin-right: 0.2em;
}
</style>