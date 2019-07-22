<template>
  <v-layout align-content-start wrap justify-start>
    <v-flex xs12 class="pa-2">
      <v-card>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" :disabled="!id" :loading="loading" @click="sync">同步</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 class="pa-2" v-for="(msg, i) in msgs" :key="i">
      <v-card>
        <v-card-text>
          <article>{{ msg.content }}</article>
        </v-card-text>
        <v-card-actions>
          <v-chip label v-for="(tag, i) in msg.tags" :key="i">
            {{ tag }}
          </v-chip>
          <v-spacer/>
          <v-chip outlined>
            <v-icon>publish</v-icon>
            {{ formatDate(msg.created) }}
          </v-chip>
          <v-chip outlined>
            <v-icon>mdi-email-edit</v-icon>
            {{ formatDate(msg.updated) }}
          </v-chip>
          <user-chip :id="msg.user"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { syncMsg, msgs } from '@/db/msg'
import { formatDate } from '@/plugins/formatter'
import userChip from '@/components/userchip.vue'

export default {
  name: 'msg',
  props: ['id'],
  components: {
    userChip
  },
  data: () => ({
    msgs: [],
    loading: false
  }),
  watch: {
    id: {
      immediate: true,
      handler () {
        this.load()
      }
    }
  },
  methods: {
    async load () {
      this.msgs = await msgs.toArray()
    },
    sync () {
      this.loading = true
      syncMsg(this.id)
        .then(this.load)
        .finally(() => { this.loading = false })
    },
    formatDate
  }
}
</script>
