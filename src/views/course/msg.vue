<template>
  <v-layout align-content-start wrap justify-start>
    <v-flex xs12 class="pa-2">
      <v-card>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary">同步</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 class="pa-2" v-for="(msg, i) in msgs" :key="i">
      <v-card>
        <v-card-text>
          <!--  -->
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'msg',
  props: ['_id'],
  data: () => ({
    msgs: []
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
