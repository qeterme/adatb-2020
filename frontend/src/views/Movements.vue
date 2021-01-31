<template>
  <div class="movements">
    <Hero title="Mozgások" subtitle="Avagy a log." />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ logs.length }}</strong> bejegyzés
          </p>
        </div>
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
                <abbr name="Mi történt?">Mi történt?</abbr>
              </th>
              <th>
                <abbr name="Mikor történt?">Mikor történt?</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="list-group-item"
              v-for="(log, index) in logs"
              :key="index"
            >
              <td>{{ log.id }}</td>
              <td>{{ log.text }}</td>
              <td>{{ log.createdAt | formatDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Hero from "@/components/Hero.vue";
import { Component, Vue } from "vue-property-decorator";
import LogsDataService from "@/services/LogsDataService";

@Component({
  components: {
    Hero,
  },
})
export default class Movements extends Vue {
  private logs: any[] = [];

  retrieveLogs() {
    LogsDataService.getAll()
      .then((response) => {
        this.logs = response.data;
        console.log(response.data);
        this.$Progress.finish();
      })
      .catch((e) => {
        console.log(e);
        this.$Progress.fail();
      });
  }

  mounted() {
    this.retrieveLogs();
  }

  beforeMount() {
    this.$Progress.start();
  }
}
</script>