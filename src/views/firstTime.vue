<template>
  <v-layout align-center justify-center>
    <v-flex sm12 xs3 lg4>
      <v-card>
        <v-card-title>初次同步</v-card-title>
        <v-card-text>
          <pre>{{ log }}</pre>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'firstTime',
  data: () => ({}),
  async mounted () {
    //
  }
}
</script>
