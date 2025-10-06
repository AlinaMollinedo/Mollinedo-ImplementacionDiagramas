<script setup>
import { ref, watch } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)
const errorLower = ref('')
const errorUpper = ref('')

const headers = ref([
  { title: 'Nro', key: 'sim', sortable: false },
  { title: 'Ganancia neta', key: 'GNeta', sortable: false },
  { title: 'Costo total', key: 'CT', sortable: false },
  { title: 'Demanda insatisfecha', key: 'DIT', sortable: false },
])

// Variables para la simulación
const NSim = ref()
const NMax = ref()
const c = ref()

const inventario = ref()
const demanda = ref(100)
const DA = ref()
const rDA = ref()
const reorder = ref(7)

const upperLimit = ref(3)
const lowerLimit = ref(1)

const CapB = ref(700)
const CReo = ref(100)
const CI = ref(0.1)
const CAdq = ref(3.5)
const PV = ref(5)

const TE = ref()
const rTE = ref()

const GNeta = ref()
const DIT = ref()
const pedido = ref()
const CT = ref()
const CDI = ref()
const CTAdq = ref()
const CTReo = ref()
const ingresoBruto = ref()

const PGNeta = ref()
const PDIT = ref()
const PCT = ref()

const results = ref([])

// Funciones para el formulario
const clear = () => {
  form.value.reset()

  submitted.value = false

  NSim.value = null
  NMax.value = null
  upperLimit.value = null
  lowerLimit.value = null
  demanda.value = null
  CapB.value = null
  reorder.value = null
  CReo.value = null
  CI.value = null
  CAdq.value = null
  PV.value = null
  results.value = []
}

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
  demanda.value = Number(demanda.value)
  CapB.value = Number(CapB.value)
  reorder.value = Number(reorder.value)
  CReo.value = Number(CReo.value)
  CI.value = Number(CI.value)
  CAdq.value = Number(CAdq.value)
  PV.value = Number(PV.value)

  results.value = []

  for (let i = 0; i < NSim.value; i++) {
    c.value = 0
    TE.value = 0
    inventario.value = CapB.value
    DIT.value = 0
    CTAdq.value = 0
    CTReo.value = 0
    CDI.value = 0
    ingresoBruto.value = 0
    const sims = []

    while (c.value < NMax.value) {
      c.value++

      if (TE.value != 0) {
        TE.value = TE.value - 1
        if (TE.value == 0) {
          inventario.value = inventario.value + pedido.value
          CTReo.value = CTReo.value + CReo.value
        }
      }

      if (c.value % reorder.value == 0) {
        pedido.value = CapB.value - inventario.value
        CTAdq.value = CTAdq.value + pedido.value * CAdq.value
        rTE.value = Math.random()
        TE.value = Number(
          (lowerLimit.value + (upperLimit.value - lowerLimit.value) * rTE.value).toFixed(0),
        )
      } else {
        rDA.value = Math.random()
        DA.value = Number((-demanda.value * Math.log(1 - rDA.value)).toFixed(0))
        if (DA.value < inventario.value) {
          ingresoBruto.value = ingresoBruto.value + DA.value * PV.value
          inventario.value = inventario.value - DA.value
          CDI.value = CDI.value + inventario.value * CI.value
        } else {
          DIT.value = DIT.value + DA.value - inventario.value
          ingresoBruto.value = ingresoBruto.value + inventario.value * PV.value
          inventario.value = 0
        }
      }
      sims.push({
        c: c.value,
        DA: DA.value,
        I: inventario.value,
        DIT: DIT.value,
        TE: TE.value,
      })
    }

    CT.value = Number(CDI.value) + Number(CTAdq.value) + Number(CTReo.value)
    GNeta.value = Number(ingresoBruto.value) - Number(CT.value)

    results.value.push({
      sim: i + 1,
      GNeta: Number(GNeta.value.toFixed(2)),
      CT: Number(CT.value.toFixed(2)),
      DIT: DIT.value,
      sims: sims,
    })
  }

  const sums = results.value.reduce(
    (acc, obj) => {
      acc.GNeta += obj.GNeta
      acc.CT += obj.CT
      acc.DIT += obj.DIT
      return acc
    },
    { GNeta: 0, CT: 0, DIT: 0 },
  )

  PGNeta.value = sums.GNeta / NSim.value
  PCT.value = sums.CT / NSim.value
  PDIT.value = sums.DIT / NSim.value
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
              La demanda de azúcar en una tienda sigue una distribución exponencial con media de kg
              al día de:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="input"
                v-model="demanda"
                label="Demanda"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere una demanda',
                  (v) => v > 0 || 'La demanda debe ser un número positivo',
                ]"
                required
                suffix="Kg/Día"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex horizontal align-center" cols="12">
              <p>El dueño de la tienda revisa el inventario cada</p>
              <v-text-field
                class="input pl-8"
                v-model="reorder"
                label="Días"
                type="number"
                :rules="[
                  (v) => !!v || 'Los días para reordenar son requeridos',
                  (v) =>
                    (Number.isInteger(parseFloat(v)) && v > 0) ||
                    'Los días para reordenar deben un número entero positivo',
                ]"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <p>
              y hace un pedido a la planta igual a la capacidad de la bodega menos la cantidad de
              azúcar que tiene disponible en ese momento. La entrega no es inmediata y sigue una
              distribución uniforme:
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
                    (Number.isInteger(parseFloat(v)) && v > 0) ||
                    'El límite inferior debe ser un número entero positivo',
                ]"
                required
                :error-messages="errorLower"
                suffix="Días/Pedido"
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
                  (v) =>
                    v > lowerLimit || 'El límite superior debe ser mayor que el límite inferior',
                ]"
                required
                :error-messages="errorUpper"
                suffix="Días/Pedido"
              />
            </v-col>
          </v-row>
          <v-row>
            <p>
              La demanda no surtida por falta de existencias representa ventas perdidas. Determinar
              el comportamiento del inventario a lo largo del tiempo, el costo y la ganancia neta,
              la demanda insatisfecha si:
            </p>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="CapB"
                label="Capacidad de la bodega"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere una capacidad de la bodega',
                  (v) => v > 0 || 'La capacidad de la bodega debe ser un número positivo',
                ]"
                required
                suffix="Kg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                class="input"
                v-model="CReo"
                label="Costo de reordenar"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un costo de reordenar',
                  (v) => v > 0 || 'El costo de reordenar debe ser un número positivo',
                ]"
                required
                suffix="Bs/Pedido"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="CI"
                label="Costo de inventario"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere una costo de inventario',
                  (v) => v > 0 || 'La costo de inventario debe ser un número positivo',
                ]"
                required
                suffix="Bs/Kg"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="CAdq"
                label="Costo de adquisición"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un costo de adquisición',
                  (v) => v > 0 || 'El costo de adquisición debe ser un número positivo',
                ]"
                required
                suffix="Bs/Kg"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                class="input"
                v-model="PV"
                label="Precio de venta"
                type="number"
                :rules="[
                  (v) => !!v || 'Se requiere un precio de venta',
                  (v) => v > 0 || 'El precio de venta debe ser un número positivo',
                ]"
                required
                suffix="Bs/Kg"
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
          <strong>Ganancia neta:</strong> {{ PGNeta.toFixed(2) }} Bs.<br />
          <strong>Costo total:</strong> {{ PCT.toFixed(2) }} Bs.<br />
          <strong>Demanda insatisfecha total:</strong> {{ PDIT.toFixed(0) }}
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

        <template v-slot:item.CT="{ item }">
          {{ item.CT.toFixed(2) + ' Bs.' }}
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table striped="even">
                <tbody>
                  <tr>
                    <th class="data-table-header">Contador (días)</th>
                    <th class="data-table-header">Demanda</th>
                    <th class="data-table-header">Inventario</th>
                    <th class="data-table-header">Demanda insatisfecha</th>
                    <th class="data-table-header">Tiempo de entrega</th>
                  </tr>
                </tbody>

                <tbody>
                  <tr v-for="sim of item.sims">
                    <td class="data-table-content">{{ sim.c }}</td>
                    <td class="data-table-content">{{ sim.DA }}</td>
                    <td class="data-table-content">{{ sim.I }}</td>
                    <td class="data-table-content">{{ sim.DIT }}</td>
                    <td class="data-table-content">{{ sim.TE }}</td>
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
