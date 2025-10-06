<script setup>
import { ref, watch } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)
const errorProbs = ref('')
const errorUpper = ref('')
const errorLower = ref('')

const headers = ref([
  { title: 'Día', key: 'sim', sortable: false },
  { title: 'Ganancia neta', key: 'GNeta', sortable: false },
  { title: 'Número de clientes', key: 'CliD', sortable: false },
  { title: 'Total de ventas', key: 'TVD', sortable: false },
])

// Variables para la simulación
const NSim = ref()
const NMax = ref()
const c = ref()

const upperLimit = ref(4)
const lowerLimit = ref(0)
const probs = ref({
  zero: 0.2,
  one: 0.3,
  two: 0.4,
  three: 0.1,
})

const LLCli = ref()
const rLLCli = ref()
const TVD = ref()
const VHrs = ref()
const CliD = ref()
const CliHrs = ref()
const CUA = ref(50)
const PVA = ref(75)
const CFD = ref(300)
const GNeta = ref()
const AVCli = ref()
const rAVCli = ref()
const PV = ref()
const PGNeta = ref()

const results = ref([])

// Funciones para el formulario
const clear = () => {
  form.value.reset()
  error.value = ''

  submitted.value = false

  NSim.value = null
  NMax.value = null
  upperLimit.value = null
  lowerLimit.value = null
  CUA.value = null
  PVA.value = null
  CFD.value = null
  results.value = []
}

watch(
  probs,
  (newProbs) => {
    const total =
      Number(newProbs.zero) + Number(newProbs.one) + Number(newProbs.two) + Number(newProbs.three)
    if (total != 1) {
      errorProbs.value = 'La suma de las probabilidades debe ser 1'
    } else {
      errorProbs.value = ''
    }
  },
  { deep: true },
)

watch(
  [upperLimit, lowerLimit],
  ([newUpper, newLower]) => {
    newUpper = Number(newUpper)
    newLower = Number(newLower)
    if (newUpper < newLower) {
      errorUpper.value = 'El límite superior debe ser mayor al límite inferior'
    } else {
      errorUpper.value = ''
    }

    if (newLower > newUpper) {
      errorLower.value = 'El límite inferior debe ser menor al límite superior'
    } else {
      errorLower.value = ''
    }
  },
  { deep: true },
)

// Funciones para la simulación
const sim = () => {
  submitted.value = true

  NSim.value = Number(NSim.value)
  NMax.value = Number(NMax.value)
  upperLimit.value = Number(upperLimit.value)
  lowerLimit.value = Number(lowerLimit.value)
  CUA.value = Number(CUA.value)
  PVA.value = Number(PVA.value)
  CFD.value = Number(CFD.value)

  results.value = []

  for (let i = 0; i < NSim.value; i++) {
    c.value = 0
    TVD.value = 0
    CliD.value = 0
    const sims = []

    while (c.value < NMax.value) {
      c.value++
      CliHrs.value = 0

      rLLCli.value = Math.random()
      LLCli.value = (
        lowerLimit.value +
        (upperLimit.value - lowerLimit.value) * rLLCli.value
      ).toFixed(0)

      CliD.value = Number(CliD.value) + Number(LLCli.value)
      CliHrs.value = Number(CliHrs.value) + Number(LLCli.value)

      while (LLCli.value > 0) {
        VHrs.value = 0
        rAVCli.value = Math.random()
        AVCli.value =
          rAVCli.value <= probs.value.zero
            ? 0
            : rAVCli.value <= probs.value.one + probs.value.zero
              ? 1
              : rAVCli.value <= probs.value.two + probs.value.one + probs.value.zero
                ? 2
                : 3
        TVD.value = TVD.value + AVCli.value
        VHrs.value = VHrs.value + AVCli.value
        LLCli.value--
      }

      sims.push({
        c: c.value,
        CliHrs: CliHrs.value,
        VHrs: VHrs.value,
      })
    }

    GNeta.value = TVD.value * PVA.value - CFD.value - TVD.value * CUA.value

    results.value.push({
      sim: i + 1,
      GNeta: GNeta.value,
      TVD: TVD.value,
      CliD: CliD.value,
      sims: sims,
    })
  }

  const sums = results.value.reduce(
    (acc, obj) => {
      acc.GNeta += obj.GNeta
      acc.TVD += obj.TVD
      return acc
    },
    { GNeta: 0, TVD: 0 },
  )

  PGNeta.value = sums.GNeta / NSim.value
  PV.value = sums.TVD / NSim.value
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
              Las llegadas de los clientes a una tienda, sigue una distribución uniforme por hora:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="lowerLimit"
                label="Límite inferior"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un límite inferior',
                  (v) =>
                    (Number.isInteger(parseFloat(v)) && v >= 0) ||
                    'El límite inferior debe ser un número entero positivo',
                ]"
                required
                :error-messages="errorLower"
                suffix="Clientes/Hora"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="upperLimit"
                label="Límite superior"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un límite superior',
                  (v) =>
                    (Number.isInteger(parseFloat(v)) && v > 0) ||
                    'El límite superior debe ser un número entero positivo',
                ]"
                required
                :error-messages="errorUpper"
                suffix="Clientes/Hora"
              />
            </v-col>
          </v-row>
          <v-row>
            <p>
              y cada cliente compra artículos de acuerdo con la siguiente función de probabilidad:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-table class="my-3" style="border-radius: 15px">
                <tbody>
                  <tr>
                    <th>Artículos</th>
                    <th class="text-center">0</th>
                    <th class="text-center">1</th>
                    <th class="text-center">2</th>
                    <th class="text-center">3</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr>
                    <td>Probabilidad</td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.zero"
                        type="number"
                        :rules="[
                          (v) => !!v || 'La probabilidad es requerida',
                          (v) =>
                            (v >= 0 && v <= 1) || 'La probabilidad debe ser mayor o igual a 0 y 1',
                        ]"
                        required
                        :error-messages="errorProbs"
                      />
                    </td>
                    <td>
                      <v-text-field
                        class="input"
                        v-model="probs.one"
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
                        v-model="probs.two"
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
                        v-model="probs.three"
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
              Mediante el desarrollo de un modelo de simulación, determine la ganancia neta del
              dueño y la cantidad de artículos vendidos de ese día si:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="CUA"
                label="Costo unitario del artículo"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un costo unitario del artículo',
                  (v) => v > 0 || 'El costo unitario del artículo debe ser un número positivo',
                ]"
                required
                suffix="Bs/Artículo"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="PVA"
                label="Precio de venta del artículo"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un precio de venta del artículo',
                  (v) => v > 0 || 'El precio de venta del artículo debe ser un número positivo',
                ]"
                required
                suffix="Bs/Artículo"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="CFD"
                label="Costo fijo diario"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un costo fijo diario',
                  (v) => v > 0 || 'El costo fijo diario debe ser un número positivo',
                ]"
                required
                suffix="Bs/Dia"
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
      <v-col cols="6">
        <v-text-field
          class="input"
          v-model="NMax"
          label="Número de horas de trabajo"
          type="number"
          :rules="[
            (v) => !!v || 'Se requiere un número de horas de trabajo',
            (v) =>
              (Number.isInteger(parseFloat(v)) && v > 0) ||
              'El número de horas de trabajo debe ser un número entero positivo',
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
          <strong>Promedio de artículos vendidos:</strong> {{ PV.toFixed(0) }} <br />
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

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table striped="even">
                <tbody>
                  <tr>
                    <th class="data-table-header">Contador (horas)</th>
                    <th class="data-table-header">Clientes</th>
                    <th class="data-table-header">Artículos vendidos</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr v-for="sim of item.sims">
                    <td class="data-table-content">{{ sim.c }}</td>
                    <td class="data-table-content">{{ sim.CliHrs }}</td>
                    <td class="data-table-content">{{ sim.VHrs }}</td>
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
