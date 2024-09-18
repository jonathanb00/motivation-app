<!-- app.vue -->
<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>

<script setup>
import 'vuetify/styles' // Import Vuetify styles

// Import the createVuetify function
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Use the head manager
import { useHead } from '@vueuse/head'

useHead({
  title: 'Motivation App',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})
</script>
