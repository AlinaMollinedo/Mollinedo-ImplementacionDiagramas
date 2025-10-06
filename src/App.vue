<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue'

const drawer = ref(false)

const route = useRoute()

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row class="hidden-sm-and-down align-center pa-4 app-bar">
        <v-col cols="1" class="justify-start">
          <v-btn class="app-bar-btn" variant="plain" to="/" tag="RouterLink">
            <v-icon size="large">{{ isActive('/') ? 'mdi-home' : 'mdi-home-outline' }}</v-icon
            >Inicio</v-btn
          >
        </v-col>
        <v-col cols="11" class="d-flex justify-end">
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama1') ? 'mdi-numeric-1-circle' : 'mdi-numeric-1-circle-outline'"
            size="x-large"
            to="/diagrama1"
            tag="RouterLink"
          />
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama2') ? 'mdi-numeric-2-circle' : 'mdi-numeric-2-circle-outline'"
            size="x-large"
            to="/diagrama2"
            tag="RouterLink"
          />
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama3') ? 'mdi-numeric-3-circle' : 'mdi-numeric-3-circle-outline'"
            size="x-large"
            to="/diagrama3"
            tag="RouterLink"
          />
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama4') ? 'mdi-numeric-4-circle' : 'mdi-numeric-4-circle-outline'"
            size="x-large"
            to="/diagrama4"
            tag="RouterLink"
          />
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama5') ? 'mdi-numeric-5-circle' : 'mdi-numeric-5-circle-outline'"
            size="x-large"
            to="/diagrama5"
            tag="RouterLink"
          />
          <v-btn
            class="app-bar-btn"
            :icon="isActive('/diagrama6') ? 'mdi-numeric-6-circle' : 'mdi-numeric-6-circle-outline'"
            size="x-large"
            to="/diagrama6"
            tag="RouterLink"
          />
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="hidden-md-and-up">
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item to="/diagrama1">
          <v-icon>mdi-numeric-1-circle-outline</v-icon>
        </v-list-item>
        <v-list-item to="/diagrama2">
          <v-icon>mdi-numeric-2-circle-outline</v-icon>
        </v-list-item>
        <v-list-item to="/diagrama3">
          <v-icon>mdi-numeric-3-circle-outline</v-icon>
        </v-list-item>
        <v-list-item to="/diagrama4">
          <v-icon>mdi-numeric-4-circle-outline</v-icon>
        </v-list-item>
        <v-list-item to="/diagrama5">
          <v-icon>mdi-numeric-5-circle-outline</v-icon>
        </v-list-item>
        <v-list-item to="/diagrama6">
          <v-icon>mdi-numeric-6-circle-outline</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>

    <v-footer class="footer order-last">
      <div class="flex-1-0-100 text-center mt-2">
        {{ new Date().getFullYear() }} — <strong>Alina Mollinedo Dávila</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap');

.v-main {
  background: linear-gradient(-90deg, rgba(250, 227, 227, 0.6), rgba(251, 230, 218, 0.8));
}

.app-bar {
  background-color: #074f57;
}

.app-bar-btn {
  font-family: 'Sour Gummy', sans-serif;
  font-size: large;
  color: #fad4c0 !important;
}

.footer {
  background-color: #074f57 !important;
  color: #fad4c0 !important;
  width: 100%;
  max-height: 100px;
  padding: 10px 0;
}

.input {
  font-family: 'Funnel Display', sans-serif;
  font-size: large;
  color: #053339 !important;
  border-radius: 50px;
  padding: 5px;
}

.btn {
  font-family: 'Sour Gummy', sans-serif;
  font-size: large !important;
  background-color: #074f57 !important;
  color: #fae3e3 !important;
  border: #074f57 !important;
  transition: all 0.5s ease-in;
}

.btn:disabled {
  font-family: 'Sour Gummy', sans-serif;
  font-size: large !important;
  background-color: transparent !important;
  color: #074f57 !important;
  border: #074f57 solid 2px !important;
}

.v-card {
  background-color: transparent !important;
}

.v-card-title,
h1 {
  font-family: 'Sour Gummy', sans-serif;
  font-size: xx-large !important;
  color: #053339 !important;
}

.v-card-text {
  font-family: 'Patrick Hand', sans-serif;
  font-size: x-large !important;
  font-weight: 500;
  color: #382e30 !important;
  margin-left: 15px;
}

.results-card {
  background-color: #d2dbd7 !important;
  color: #053339 !important;
}

.results-card .v-card-title {
  font-family: 'Sour Gummy', sans-serif !important;
}

.results-card .v-card-text {
  font-family: 'Funnel Display', sans-serif !important;
}

.v-data-table {
  background-color: #fdf3ed !important;
  border-radius: 10px;
}

th {
  font-family: 'Funnel Display', sans-serif;
  font-size: large;
  background-color: #074f57 !important;
  color: #fdf3ed !important;
}

td {
  font-family: 'Funnel Display', sans-serif;
  font-weight: 300;
  font-size: medium;
}

.v-table {
  background-color: #fdf3ed !important;
  border-radius: 10px;
}

.data-table-header {
  font-family: 'Funnel Display', sans-serif;
  font-size: large;
  background-color: #8ea499 !important;
  color: #fdf3ed !important;
}

.data-table-content {
  font-family: 'Funnel Display', sans-serif;
  font-weight: 300;
  font-size: medium;
}
</style>
