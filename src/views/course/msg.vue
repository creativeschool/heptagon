<template>
  <v-layout align-content-start wrap justify-start>
    <v-flex xs12>
      <v-card>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" :disabled="!id" :loading="loading" @click="load">同步通知</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 v-for="(msg, i) in msgs" :key="i">
      <v-card hover @click.stop="currentId = msg._id, dialog = true">
        <v-card-text v-html="renderMarkdown(msg.content)" class="content"/>
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
    <v-dialog v-model="dialog" max-width="640px">
      <msg-detail v-if="dialog" :id="currentId" @update="load"/>
    </v-dialog>
  </v-layout>
</template>

<script>
import { syncMsg, msgs } from '@/db/msg'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'
import { renderMarkdown } from '@/plugins/marked'
import userChip from '@/components/userchip.vue'
import msgDetail from '@/components/msgdetail.vue'

export default {
  name: 'msg',
  props: ['id'],
  components: {
    userChip,
    msgDetail
  },
  data: () => ({
    msgs: [],
    loading: false,
    dialog: false,
    currentId: null
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
    load () {
      this.loading = true
      return syncMsg(this.id)
        .then(() => msgs.where('course').equals(this.id).reverse().toArray())
        .then(msgs => {
          this.msgs = msgs
        })
        .finally(() => {
          this.loading = false
          bus.$emit('title', '消息列表 - ' + this.$parent.course.name)
        })
    },
    formatDate,
    renderMarkdown
  }
}
</script>

<style scoped>
.content {
  height: 5rem;
  overflow: auto;
}
</style>
