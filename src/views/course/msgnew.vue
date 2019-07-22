<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-textarea :disabled="loading" v-model="content" label="内容"/>
          <v-combobox :disabled="loading" v-model="tags" label="标签" hide-selected multiple chips/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" outlined @click="clear" :disabled="loading">清空</v-btn>
          <v-btn color="primary" @click="submit" :loading="loading" :disabled="!_id">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { createMsg } from '../../db/msg'
export default {
  name: 'msgNew',
  props: ['_id'],
  data: () => ({
    content: '',
    tags: [],
    loading: false
  }),
  methods: {
    clear () {
      this.content = ''
      this.tags = []
    },
    submit () {
      this.loading = true
      createMsg(this._id, this.content, this.tags)
        .finally(() => { this.loading = false })
    }
  },
  watch: {
    _id: {
      handler () {
        this.clear()
      }
    }
  }
}
</script>
