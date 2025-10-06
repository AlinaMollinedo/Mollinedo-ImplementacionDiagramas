<script setup>
import { ref } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)

const headers = ref([
  { title: 'Nro', key: 'sim', sortable: false },
  { title: 'Z', key: 'Z', sortable: false },
  { title: 'X1', key: 'X1', sortable: false },
  { title: 'X2', key: 'X2', sortable: false },
  { title: 'X3', key: 'X3', sortable: false },
])

// Variables para la simulación
const NSim = ref()
const NMax = ref()
const c = ref()
const X1 = ref()
const X2 = ref()
const X3 = ref()
const Z = ref()
const XC1 = ref()
const XC2 = ref()
const XC3 = ref()
const ZC = ref()
const r1 = ref()
const r2 = ref()
const r3 = ref()

const results = ref([])
const ZAvg = ref()
const X1Avg = ref()
const X2Avg = ref()
const X3Avg = ref()

// Funciones para el formulario
const clear = () => {
  form.value.reset()

  submitted.value = false

  NSim.value = null
  NMax.value = null
  results.value = []
}

// Funciones para la simulación
const sim = () => {
  submitted.value = true

  NSim.value = Number(NSim.value)
  NMax.value = Number(NMax.value)
  results.value = []

  for (let i = 0; i < NSim.value; i++) {
    c.value = 0
    Z.value = 0
    X1.value = 0
    X2.value = 0
    X3.value = 0
    const sims = []

    while (c.value < NMax.value) {
      c.value++

      r1.value = Math.random()
      XC1.value = 10 * r1.value
      r2.value = Math.random()
      XC2.value = (100 * r2.value).toFixed(0)
      XC3.value = -1

      if (XC1.value + XC2.value >= 2) {
        r3.value = Math.random()
        XC3.value = 1 + r3.value

        ZC.value = 2 * XC1.value + 3 * XC2.value - XC3.value

        if (ZC.value > Z.value) {
          Z.value = ZC.value
          X1.value = XC1.value
          X2.value = XC2.value
          X3.value = XC3.value
        }
      }

      sims.push({
        c: c.value,
        Z: Z.value,
        X1: X1.value,
        X2: X2.value,
        X3: X3.value,
        ZC: ZC.value,
        XC1: XC1.value,
        XC2: XC2.value,
        XC3: XC3.value,
      })
    }

    results.value.push({
      sim: i + 1,
      Z: Z.value,
      X1: X1.value,
      X2: X2.value,
      X3: X3.value,
      sims: sims,
    })
  }

  const sums = results.value.reduce(
    (acc, obj) => {
      acc.Z += obj.Z
      acc.X1 += obj.X1
      acc.X2 += obj.X2
      acc.X3 += obj.X3
      return acc
    },
    { Z: 0, X1: 0, X2: 0, X3: 0 },
  )

  ZAvg.value = sums.Z / NSim.value
  X1Avg.value = sums.X1 / NSim.value
  X2Avg.value = sums.X2 / NSim.value
  X3Avg.value = sums.X3 / NSim.value
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
              Encontrar el máximo de la siguiente función: z = 2x<sub>1</sub> + 3x<sub>2</sub> -
              x<sub>3</sub>
            </p>
          </v-row>
          <v-row>
            <v-col cols="2">
              <p>s.a.</p>
            </v-col>
            <v-col cols="10">
              <p>
                x<sub>1</sub>, x<sub>2</sub>
                <v-icon size="x-small">mdi-greater-than-or-equal</v-icon> 2
                <br />
                1 <v-icon size="x-small">mdi-less-than-or-equal</v-icon> x<sub>3</sub>
                <v-icon size="x-small">mdi-less-than-or-equal</v-icon> 2
                <br />
                x<sub>2</sub> <v-icon size="x-small">mdi-greater-than-or-equal</v-icon> 0 (Entero)
                <br />
                0 <v-icon size="x-small">mdi-less-than-or-equal</v-icon> x<sub>1</sub>
                <v-icon size="x-small">mdi-less-than-or-equal</v-icon> 10
                <br />
                0 <v-icon size="x-small">mdi-less-than-or-equal</v-icon> x<sub>2</sub>
                <v-icon size="x-small">mdi-less-than-or-equal</v-icon> 100
              </p>
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
          label="Número de iteraciones"
          type="number"
          :rules="[
            (v) => !!v || 'Se requiere un número de iteraciones',
            (v) =>
              (Number.isInteger(parseFloat(v)) && v > 0) ||
              'El número de iteraciones debe ser un número entero positivo',
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
          <strong>Z:</strong> {{ Z.toFixed(2) }} <br />
          <strong>X1:</strong> {{ X1.toFixed(2) }} <br />
          <strong>X2:</strong> {{ X2 }} <br />
          <strong>X3:</strong> {{ X3.toFixed(2) }}
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
        <template v-slot:item.Z="{ item }">
          {{ parseFloat(item.Z).toFixed(2) }}
        </template>

        <template v-slot:item.X1="{ item }">
          {{ parseFloat(item.X1).toFixed(2) }}
        </template>

        <template v-slot:item.X2="{ item }">
          {{ parseFloat(item.X2).toFixed(2) }}
        </template>

        <template v-slot:item.X3="{ item }">
          {{ parseFloat(item.X3).toFixed(2) }}
        </template>
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table striped="even">
                <tbody>
                  <tr>
                    <th class="data-table-header">Contador</th>
                    <th class="data-table-header">XC1</th>
                    <th class="data-table-header">XC2</th>
                    <th class="data-table-header">XC3</th>
                    <th class="data-table-header">ZC</th>
                    <th class="data-table-header">X1</th>
                    <th class="data-table-header">X2</th>
                    <th class="data-table-header">X3</th>
                    <th class="data-table-header">Z</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr v-for="sim of item.sims">
                    <td class="data-table-content">{{ sim.c }}</td>
                    <td class="data-table-content">{{ sim.XC1.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.XC2 }}</td>
                    <td class="data-table-content">{{ sim.XC3.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.ZC.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.X1.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.X2 }}</td>
                    <td class="data-table-content">{{ sim.X3.toFixed(2) }}</td>
                    <td class="data-table-content">{{ sim.Z.toFixed(2) }}</td>
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
