<template>
  <v-layout align-content-start>
    <v-flex xs12>
      <v-card>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'msg',
  props: ['_id'],
  data: () => ({
    //
  }),
  watch: {
    _id: {
      immediate: true,
      handler () {
        this.load()
      }
    }
  },
  methods: {
    async load () {
      //
    }
  }
}
</script>
