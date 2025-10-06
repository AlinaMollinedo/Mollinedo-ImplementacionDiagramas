<script setup>
import { ref, watch } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)
const errorProbs1 = ref('')
const errorProbs2 = ref('')

const headers = ref([
  { title: 'Día', key: 'sim', sortable: false },
  { title: 'Ganancia neta', key: 'GNeta', sortable: false },
  { title: 'Total de huevos', key: 'TH', sortable: false },
  { title: 'Total de pollos sobrevivientes', key: 'TPS', sortable: false },
  { title: 'Ingreso promedio diario', key: 'IPD', sortable: false },
])

// Variables para la simulación
const NSim = ref()
const NMax = ref()
const c = ref()

const lambda = ref(2)
const probs = ref({
  broken: 0.2,
  chick: 0.3,
  egg: 0.5,
  dead: 0.2,
  alive: 0.8,
})
const poisson = ref([])

const NHQP = ref()
const rNHQP = ref()
const rEH = ref()
const TH = ref()
const THR = ref()
const TPS = ref()
const TPM = ref()
const NH = ref()
const NHR = ref()
const NPS = ref()
const NPM = ref()
const rEP = ref()
const GNeta = ref()
const IPD = ref()
const PVP = ref(5)
const PVH = ref(1.5)

const PGNeta = ref()
const PTH = ref()
const PTPS = ref()
const PI = ref()

const results = ref([])

// Funciones para el formulario
const clear = () => {
  form.value.reset()

  submitted.value = false

  NMax.value = null
  lambda.value = null
  PVP.value = null
  PVH.value = null
  results.value = []
}

watch(
  probs,
  (newProbs) => {
    const total1 = Number(newProbs.broken) + Number(newProbs.chick) + Number(newProbs.egg)

    const total2 = Number(newProbs.dead) + Number(newProbs.alive)

    if (total1 != 1) {
      errorProbs1.value = 'La suma de las probabilidades debe ser 1'
    } else {
      errorProbs1.value = ''
    }

    if (total2 != 1) {
      errorProbs2.value = 'La suma de las probabilidades debe ser 1'
    } else {
      errorProbs2.value = ''
    }
  },
  { deep: true },
)

// Funciones para la simulación
const sim = () => {
  submitted.value = true

  NSim.value = Number(NSim.value)
  NMax.value = Number(NMax.value)
  calcPoisson()
  PVP.value = Number(PVP.value)
  PVH.value = Number(PVH.value)

  results.value = []

  for (let i = 0; i < NSim.value; i++) {
    c.value = 0
    TH.value = 0
    THR.value = 0
    TPS.value = 0
    TPM.value = 0
    const sims = []

    while (c.value < NMax.value) {
      c.value++
      NH.value = 0
      NHR.value = 0
      NPS.value = 0
      NPM.value = 0

      rNHQP.value = Math.random()
      for (let i = 0; i < poisson.value.length - 1; i++) {
        if (rNHQP.value >= poisson.value[i] && rNHQP.value < poisson.value[i + 1]) {
          NHQP.value = i
        }
      }

      const NHQPcopy = NHQP.value

      while (NHQP.value > 0) {
        rEH.value = Math.random()
        if (rEH.value <= probs.value.broken) {
          THR.value++
          NHR.value++
        } else if (rEH.value <= probs.value.broken + probs.value.chick) {
          rEP.value = Math.random()
          if (rEP.value <= probs.value.dead) {
            TPM.value++
            NPM.value++
          } else {
            TPS.value++
            NPS.value++
          }
        } else {
          TH.value++
          NH.value++
        }
        NHQP.value--
      }

      GNeta.value = NH.value * PVH.value + NPS.value * PVP.value

      sims.push({
        c: c.value,
        GNeta: GNeta.value,
        NHQP: NHQPcopy,
        NH: NH.value,
        NHR: NHR.value,
        NPS: NPS.value,
        NPM: NPM.value,
      })
    }

    GNeta.value = TH.value * PVH.value + TPS.value * PVP.value
    IPD.value = GNeta.value / NMax.value

    results.value.push({
      sim: i + 1,
      GNeta: GNeta.value,
      TH: TH.value,
      TPS: TPS.value,
      IPD: IPD.value,
      sims: sims,
    })
  }

  const sums = results.value.reduce(
    (acc, obj) => {
      acc.GNeta += obj.GNeta
      acc.TH += obj.TH
      acc.TPS += obj.TPS
      acc.IPD += obj.IPD
      return acc
    },
    { GNeta: 0, TH: 0, TPS: 0, IPD: 0 },
  )

  PGNeta.value = sums.GNeta / NSim.value
  PTH.value = sums.TH / NSim.value
  PTPS.value = sums.TPS / NSim.value
  PI.value = sums.IPD / NSim.value
}

const calcPoisson = () => {
  lambda.value = Number(lambda.value)
  let total = 0
  let i = 0

  poisson.value = []
  poisson.value.push(0)
  while (total < 1) {
    let poissonI =
      Math.round(((Math.pow(lambda.value, i) * Math.exp(-lambda.value)) / factorial(i)) * 100) / 100
    let temp = Number(poissonI) + Number(poisson.value[i])
    poisson.value.push(Number(temp))
    total = total + Number(poissonI)
    i++
  }
}

const factorial = (num) => {
  if (num === 0 || num === 1) return 1
  for (var i = num - 1; i >= 1; i--) {
    num *= i
  }
  return num
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
              Un granjero tiene una gallina que pone huevos una razón de Poisson con media de huevos
              al día de:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="input"
                v-model="lambda"
                label="Lambda"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere Lambda',
                  (v) => v > 0 || 'El límite inferior debe ser un número positivo',
                ]"
                required
                suffix="Huevos/Día"
              />
            </v-col>
          </v-row>
          <v-row>
            <p>
              y los huevos cambian de estado de acuerdo con la siguiente función de probabilidad:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-table class="my-3" style="border-radius: 15px">
                <tbody>
                  <tr>
                    <th>Estado</th>
                    <th class="text-center">Roto</th>
                    <th class="text-center">Pollo</th>
                    <th class="text-center">Huevo</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr>
                    <td>Probabilidad</td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.broken"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                        :error-messages="errorProbs1"
                      />
                    </td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.chick"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                      />
                    </td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.egg"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
          <v-row>
            <p>
              Los pollos mueren o sobreviven de acuerdo con la siguiente función de probabilidad:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-table class="my-3" style="border-radius: 15px">
                <tbody>
                  <tr>
                    <th>Estado</th>
                    <th class="text-center">Muerto</th>
                    <th class="text-center">Sobrevive</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr>
                    <td>Probabilidad</td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.dead"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                        :error-messages="errorProbs2"
                      />
                    </td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.alive"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
          <v-row>
            <p>Simule este sistema si:</p>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="PVH"
                label="Precio de venta de huevo"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un precio de venta de huevo',
                  (v) => v > 0 || 'El precio de venta de huevo debe ser un número positivo',
                ]"
                required
                suffix="Bs/Huevo"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="PVP"
                label="Precio de venta de pollo"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un precio de venta de pollo',
                  (v) => v > 0 || 'El precio de venta de pollo debe ser un número positivo',
                ]"
                required
                suffix="Bs/Pollo"
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
      <v-col cols="12" sm="6">
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
      <v-col cols="12" sm="6">
        <v-text-field
          class="input"
          v-model="NMax"
          label="Número de días"
          type="number"
          :rules="[
            (v) => !!v || 'Se requiere un número de días',
            (v) =>
              (Number.isInteger(parseFloat(v)) && v > 0) ||
              'El número de días debe ser un número entero positivo',
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
          <strong>Ganancia neta:</strong> {{ PGNeta.toFixed(2) }} Bs. <br />
          <strong>Promedio de huevos:</strong> {{ PTH.toFixed(0) }} <br />
          <strong>Promedio de pollos sobrevivientes:</strong> {{ PTPS.toFixed(0) }} <br />
          <strong>Ingreso promedio:</strong> {{ PI.toFixed(2) }} Bs.
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
          {{ item.GNeta.toFixed(2) + ' Bs.' }}
        </template>

        <template v-slot:item.IPD="{ item }">
          {{ item.IPD.toFixed(2) + ' Bs.' }}
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table striped="even">
                <tbody>
                  <tr>
                    <th class="data-table-header">Contador (días)</th>
                    <th class="data-table-header">Ganancia Neta</th>
                    <th class="data-table-header">Número de huevos puestos</th>
                    <th class="data-table-header">Número de huevos</th>
                    <th class="data-table-header">Número de huevos rotos</th>
                    <th class="data-table-header">Número de pollos sobrevivientes</th>
                    <th class="data-table-header">Número de pollos muertos</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr v-for="sim of item.sims">
                    <td class="data-table-content">{{ sim.c }}</td>
                    <td class="data-table-content">{{ sim.GNeta.toFixed(2) }} Bs.</td>
                    <td class="data-table-content">{{ sim.NHQP }}</td>
                    <td class="data-table-content">{{ sim.NH }}</td>
                    <td class="data-table-content">{{ sim.NHR }}</td>
                    <td class="data-table-content">{{ sim.NPS }}</td>
                    <td class="data-table-content">{{ sim.NPM }}</td>
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
