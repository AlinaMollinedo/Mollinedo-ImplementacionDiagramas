<script setup>
import { ref, watch } from 'vue'

// Variables para el formulario
const form = ref()
const isValid = ref(false)
const submitted = ref(false)
const errK = ref('')

const conditionals = ref([{ lowerLimit: 1, upperLimit: 1000, interestRate: 3.5 }])

// Variables para la simulación
const T = ref()
const c = ref()
const K = ref()
const KFinal = ref()
const I = ref()
const i = ref()
const results = ref([])

// Funciones para el formulario
const addConditional = () => {
  const lastUpperLimit = conditionals.value[conditionals.value.length - 1].upperLimit
  conditionals.value.push({
    lowerLimit: Number(lastUpperLimit) + 1,
    upperLimit: Number(lastUpperLimit) + 1000,
    interestRate: 5,
  })
}

const removeConditional = (index) => {
  if (conditionals.value.length > 1) {
    conditionals.value.splice(index, 1)
  }
}

watch(
  conditionals,
  (newConditionals) => {
    for (let i = 0; i < newConditionals.length - 1; i++) {
      const current = newConditionals[i]
      const next = newConditionals[i + 1]
      if (next.lowerLimit !== current.upperLimit) {
        next.lowerLimit = Number(current.upperLimit) + 1
      }
    }
  },
  { deep: true },
)

watch(
  [K, conditionals],
  ([newK, newConditionals]) => {
    if (Number(newK) > Number(newConditionals[newConditionals.length - 1].upperLimit)) {
      errK.value = 'El capital no puede ser mayor que el último límite superior.'
    } else {
      errK.value = ''
    }
  },
  { deep: true },
)

const clear = () => {
  form.value.reset()

  submitted.value = false

  T.value = null
  K.value = null
  conditionals.value = [{ lowerLimit: 1, upperLimit: 1000, interestRate: 3.5 }]
  results.value = []
}

// Funciones para la simulación
const sim = () => {
  submitted.value = true

  c.value = 0
  T.value = Number(T.value)
  K.value = Number(K.value)
  KFinal.value = K.value
  results.value = []

  for (const conditional of conditionals.value) {
    if (K.value >= conditional.lowerLimit && K.value <= conditional.upperLimit) {
      i.value = conditional.interestRate
    }
  }

  while (c.value < T.value) {
    c.value++
    I.value = (KFinal.value * i.value) / 100
    KFinal.value = KFinal.value + I.value
    results.value.push({
      C: c.value,
      I: I.value,
      K: KFinal.value,
    })
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card variant="flat">
        <v-card-title>Descripción del problema</v-card-title>
        <v-card-text>Simular un depósito a plazo fijo si:</v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-form ref="form" v-model="isValid" @submit.prevent="sim()">
    <v-card variant="flat">
      <v-row class="mx-4">
        <v-col cols="6">
          <v-text-field
            class="input"
            v-model="K"
            label="Capital Inicial"
            type="number"
            :rules="[
              (v) => !!v || 'Se requiere un capital inicial',
              (v) => v > 0 || 'El capital inicial debe ser un número positivo',
            ]"
            required
            :error-messages="errK"
            suffix="Bs."
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            class="input"
            v-model="T"
            label="Tiempo de depósito"
            type="number"
            :rules="[
              (v) => !!v || 'Se requiere un tiempo de depósito',
              (v) =>
                (Number.isInteger(parseFloat(v)) && v > 0) ||
                'El tiempo de depósito debe ser un número entero positivo',
            ]"
            required
            suffix="Años"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-start align-center horizontal" cols="12">
          <v-card-title>Tasa de interés</v-card-title>
          <v-btn class="plus-btn" size="small" @click="addConditional" icon="mdi-plus" />
        </v-col>
      </v-row>
      <v-row class="mx-8" v-for="(conditional, index) in conditionals" :key="index">
        <v-col>
          <v-card variant="flat">
            <v-row class="d-flex justify-center align-center">
              <v-col cols="3">
                <v-text-field
                  class="input"
                  v-model="conditional.lowerLimit"
                  label="Límite inferior"
                  type="number"
                  :rules="[
                    (v) => !!v || 'Se requiere un límite inferior',
                    (v) => v > 0 || 'El límite inferior debe ser un número positivo',
                  ]"
                  required
                  readonly
                  suffix="Bs."
                />
              </v-col>
              <v-col cols="1" class="text-center">
                <v-icon>mdi-less-than-or-equal</v-icon>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="input"
                  v-model="conditional.upperLimit"
                  label="Límite superior"
                  type="number"
                  :rules="[
                    (v) => !!v || 'Se requiere un límite superior',
                    (v) => v > 0 || 'El límite superior debe ser un número positivo',
                    (v) =>
                      v > conditional.lowerLimit ||
                      'El límite superior debe ser mayor que el límite inferior',
                  ]"
                  required
                  suffix="Bs."
                />
              </v-col>
              <v-col cols="1" class="text-center">
                <v-icon>mdi-arrow-right-thin</v-icon>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="input"
                  v-model="conditional.interestRate"
                  label="Tasa de interés"
                  type="number"
                  :rules="[
                    (v) => !!v || 'Se requiere una tasa de interés',
                    (v) => v > 0 || 'La tasa de interés debe ser un número positivo',
                  ]"
                  required
                  suffix="%"
                />
              </v-col>
              <v-col class="mb-5" cols="1">
                <v-btn
                  @click="removeConditional(index)"
                  color="#9e2a2b"
                  v-if="conditionals.length > 1 && index != 0"
                  icon="mdi-minus"
                  size="small"
                />
              </v-col>
            </v-row>
          </v-card>
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
    </v-card>
  </v-form>
  <v-row v-if="submitted">
    <v-col cols="12">
      <v-card class="ma-4 results-card" variant="elevated" elevation="3">
        <v-card-text><strong>Capital total:</strong> {{ KFinal.toFixed(2) }} Bs.</v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row class="px-2 pb-12" v-if="submitted">
    <v-col cols="12">
      <v-table class="elevation-1" striped="even">
        <thead>
          <tr>
            <th class="table-header">Contador</th>
            <th class="table-header">Interés</th>
            <th class="table-header">Capital</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res of results">
            <td class="table-content">{{ res.C }}</td>
            <td class="table-content">{{ res.I.toFixed(2) }} Bs.</td>
            <td class="table-content">{{ res.K.toFixed(2) }} Bs.</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<style scoped>
.plus-btn {
  color: #fbe6da;
  background-color: #074f57;
}

.table-header {
  font-family: 'Funnel Display', sans-serif;
  font-size: large;
  background-color: #074f57 !important;
  color: #fdf3ed !important;
}

.table-content {
  font-family: 'Funnel Display', sans-serif;
  font-weight: 300;
  font-size: medium;
}
</style>
