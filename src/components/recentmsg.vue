<template>
  <v-card>
    <v-card-title>最近通知</v-card-title>
    <v-card-text v-for="(msg, i) in msgs" :key="i">
      <v-card outlined>
        <v-card-text v-html="renderMarkdown(msg.content)" class="content"/>
        <v-card-actions>
          <v-chip label v-for="(tag, i) in msg.tags" :key="i">
            {{ tag }}
          </v-chip>
          <v-spacer/>
          <v-chip outlined>
            <v-icon left>mdi-publish</v-icon>
            {{ formatDate(msg.created) }}
          </v-chip>
          <v-chip outlined>
            <v-icon left>mdi-email-edit</v-icon>
            {{ formatDate(msg.updated) }}
          </v-chip>
          <user-chip :id="msg.user"/>
          <course-chip :id="msg.course"/>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { syncAllMsg, msgs } from '@/db/msg'
import { renderMarkdown } from '@/plugins/marked'
import { formatDate } from '@/plugins/formatter'
import userChip from '@/components/userchip.vue'
import courseChip from '@/components/coursechip.vue'

export default {
  name: 'recentMsg',
  components: {
    userChip,
    courseChip
  },
  data: () => ({
    msgs: [],
    loading: false
  }),
  methods: {
    async load () {
      this.loading = true
      await syncAllMsg()
      this.msgs = await msgs.orderBy('created').reverse().limit(10).toArray()
      this.loading = false
    },
    renderMarkdown,
    formatDate
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>
.content {
  height: 5rem;
  overflow: auto;
}
</style>
