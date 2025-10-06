<template>
  <v-row class="pa-6">
    <h1>Producto 2: Implementacion de los Diagramas de Flujo</h1>
  </v-row>
  <v-row>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-1-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-cash-multiple</v-icon>Simulación de un depósito
              a plazo fijo
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama1" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-2-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-variable</v-icon>Simulación de la maximización
              de una función sujeta a restricciones
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama2" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-3-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-dice-multiple</v-icon>Simulación de un juego de
              azar con dados
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama3" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-4-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-store</v-icon>Simulación de una tienda con
              llegadas de clientes uniforme
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama4" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-5-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-egg</v-icon>Simulación de un granjero que vende
              huevos y pollos
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama5" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="home-card" elevation="3">
        <v-card-title>Diagrama <v-icon>mdi-numeric-6-circle-outline</v-icon></v-card-title>
        <v-card-text>
          <v-row class="d-flex horizontal align-center pt-2">
            <p>
              <v-icon class="mr-2" size="small">mdi-cube-outline</v-icon>Simulación de una tienda de
              azúcar con demanda exponencial
            </p>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="home-btn" block to="/diagrama6" tag="RouterLink">Ir</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.home-card {
  background-color: #d2dbd6 !important;
  height: 100% !important;
}

.home-card v-card-title {
  color: #07434b !important;
}

.home-card v-card-text {
  color: #382e30;
}

.home-btn {
  font-family: 'Sour Gummy', sans-serif;
  font-size: larger;
  background-color: #d2dbd6;
  color: #07434b;
  border: #07434b solid 2px;
  border-radius: 10px;
  transform: color 0.4s ease;

  &:hover {
    background-color: #07434b;
    color: #d2dbd6;
  }
}
</style>
