<template>
  <v-dialog>
  </v-dialog>
</template>

<script>
import { msgs } from '@/db/msg'

export default {
  name: 'msgEdit',
  props: ['value', 'id'],
  model: {
    prop: 'value',
    event: 'update:value'
  },
  data: () => ({
    content: '',
    tags: [],
    showDialog: false
  }),
  watch: {
    value: {
      handler () {
        if (this.showDialog !== this.value) {
          this.showDialog = this.value
        }
      }
    },
    showDialog: {
      handler () {
        if (this.showDialog !== this.value) {
          this.$emit('update:value', this.showDialog)
        }
      }
    }
  },
  created () {
    this.showDialog = this.value
  },
  methods: {
    async load () {
      const msg = await msgs.get(this.id)
      if (!msg) {
        //
      }
      this.content = msg.content
      this.tags = msg.tags
    }
  }
}
</script>
