<script setup>
import { ref } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)

const headers = ref([
  { title: 'Nro', key: 'sim', sortable: false },
  { title: 'Ganancia neta', key: 'GNeta', sortable: false },
  { title: 'Juegos ganados', key: 'NG', sortable: false },
  { title: 'Porcentaje de juegos ganados', key: 'PG', sortable: false },
])

// Variables para la simulación
const NSim = ref()
const NMax = ref()
const c = ref()
const win = ref(7)
const D1 = ref()
const D2 = ref()
const IUJ = ref(2)
const GNeta = ref()
const CU7 = ref(5)
const SDados = ref()
const r1 = ref()
const r2 = ref()
const NG = ref()
const PG = ref()

const PGNeta = ref()
const PJG = ref()
const PTG = ref()

const results = ref([])

// Funciones para el formulario
const clear = () => {
  form.value.reset()

  submitted.value = false

  NSim.value = null
  NMax.value = null
  IUJ.value = null
  CU7.value = null
  results.value = []
}

// Funciones para la simulación
const sim = () => {
  submitted.value = true

  NSim.value = Number(NSim.value)
  NMax.value = Number(NMax.value)
  IUJ.value = Number(IUJ.value)
  CU7.value = Number(CU7.value)
  results.value = []

  for (let i = 0; i < NSim.value; i++) {
    c.value = 0
    GNeta.value = 0
    NG.value = 0
    const sims = []

    while (c.value < NMax.value) {
      c.value++

      GNeta.value = GNeta.value + IUJ.value
      r1.value = Math.random()
      D1.value = (1 + 5 * r1.value).toFixed(0)
      r2.value = Math.random()
      D2.value = (1 + 5 * r2.value).toFixed(0)
      SDados.value = Number(D1.value) + Number(D2.value)

      if (SDados.value == win.value) {
        GNeta.value = GNeta.value - CU7.value
      } else {
        NG.value++
      }

      sims.push({
        c: c.value,
        D1: D1.value,
        D2: D2.value,
        SDados: SDados.value,
        GNeta: GNeta.value,
        NG: NG.value,
      })
    }

    PG.value = (NG.value / NMax.value) * 100

    results.value.push({
      sim: i + 1,
      GNeta: GNeta.value,
      NG: NG.value,
      PG: PG.value,
      sims: sims,
    })
  }

  const sums = results.value.reduce(
    (acc, obj) => {
      acc.GNeta += obj.GNeta
      acc.NG += obj.NG
      acc.PG += obj.PG
      return acc
    },
    { GNeta: 0, NG: 0, PG: 0 },
  )

  PGNeta.value = sums.GNeta / NSim.value
  PJG.value = sums.NG / NSim.value
  PTG.value = sums.PG / NSim.value
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card variant="flat">
        <v-card-title>Descripción del problema</v-card-title>
        <v-card-text>
          <v-row>
            <p>
              El apostador lanza dos dados y si saca lo siguiente en la suma de los dados, gana.
              Caso contrario, pierde.
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="input"
                v-model="win"
                label="Suma ganadora"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere una suma ganadora',
                  (v) => (v >= 1 && v <= 12) || 'La suma ganadora debe ser un número entre 1 y 12',
                ]"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <p>
              Simule el juego y determine la ganancia neta de la casa, el número de juegos que gana
              la casa y el porcentaje de juegos que gana la casa si
            </p>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="IUJ"
                label="Precio por jugar"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un precio por jugar',
                  (v) => v > 0 || 'El precio por jugar debe ser un número positivo',
                ]"
                required
                suffix="Bs."
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="input"
                v-model="CU7"
                label="Costo si el apostador gana"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un costo',
                  (v) => v > 0 || 'El costo debe ser un número positivo',
                ]"
                required
                suffix="Bs."
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-form ref="form" v-model="isValid" @submit.prevent="sim()">
    <v-row>
      <h1>Datos para la simulación</h1>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          class="input"
          v-model="NSim"
          label="Número de simulaciones"
          type="number"
          :rules="[
            (v) => !!v || 'Se requiere un número de simulaciones',
            (v) =>
              (Number.isInteger(parseFloat(v)) && v > 0) ||
              'El número de simulaciones debe ser un número entero positivo',
          ]"
          required
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          class="input"
          v-model="NMax"
          label="Número de lanzamientos"
          type="number"
          :rules="[
            (v) => !!v || 'Se requiere un número de lanzamientos',
            (v) =>
              (Number.isInteger(parseFloat(v)) && v > 0) ||
              'El número de lanzamientos debe ser un número entero positivo',
          ]"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn class="btn" @click="sim" :disabled="!isValid" block> Simular </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn class="btn" @click="clear" :disabled="!submitted" block> Limpiar </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-row v-if="submitted">
    <v-col cols="12">
      <v-card class="ma-4 results-card" variant="elevated" elevation="3">
        <v-card-title>Promedios de las simulaciones</v-card-title>
        <v-card-text>
          <strong>Ganancia neta:</strong> {{ PGNeta.toFixed(2) }} Bs.<br />
          <strong>Promedio de juegos ganados:</strong> {{ PJG.toFixed(0) }} <br />
          <strong>Porcentaje de juegos ganados:</strong> {{ PTG.toFixed(2) }}% <br />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table
        v-if="submitted"
        :headers="headers"
        :items="results"
        item-value="sim"
        hide-actions
        show-expand
        striped="even"
      >
        <template v-slot:item.GNeta="{ item }">
          {{ item.GNeta + ' Bs.' }}
        </template>

        <template v-slot:item.PG="{ item }">
          {{ item.PG + '%' }}
        </template>
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table striped="even">
                <tbody>
                  <tr>
                    <th class="data-table-header">Contador (lanzamientos)</th>
                    <th class="data-table-header">Dado 1</th>
                    <th class="data-table-header">Dado 2</th>
                    <th class="data-table-header">Suma de los dados</th>
                    <th class="data-table-header">Ganancia Neta</th>
                    <th class="data-table-header">Juegos Ganados</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr v-for="sim of item.sims">
                    <td class="data-table-content">{{ sim.c }}</td>
                    <td class="data-table-content">{{ sim.D1 }}</td>
                    <td class="data-table-content">{{ sim.D2 }}</td>
                    <td class="data-table-content">{{ sim.SDados }}</td>
                    <td class="data-table-content">{{ sim.GNeta.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.NG }}</td>
                  </tr>
                </tbody>
              </v-table>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
