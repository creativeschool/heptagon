<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-textarea :disabled="loading" v-model="content">
            <template v-slot:label>
              内容<v-icon>mdi-markdown</v-icon>
            </template>
          </v-textarea>
          <v-combobox :disabled="loading" v-model="tags" label="标签" hide-selected multiple chips/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" outlined @click="clear" :disabled="loading">清空</v-btn>
          <v-btn color="primary" @click="submit" :loading="loading" :disabled="!id">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { createMsg } from '@/db/msg'
import { bus } from '@/plugins/bus'

export default {
  name: 'msgNew',
  props: ['id'],
  data: () => ({
    content: '',
    tags: [],
    loading: false
  }),
  methods: {
    load () {
      this.clear()
      bus.$emit('title', '新建通知 - ' + this.$parent.course.name)
    },
    clear () {
      this.content = ''
      this.tags = []
    },
    submit () {
      this.loading = true
      createMsg(this.id, this.content, this.tags)
        .finally(() => { this.loading = false })
    }
  },
  watch: {
    id: {
      immediate: true,
      handler () {
        this.load()
      }
    }
  }
}
</script>
