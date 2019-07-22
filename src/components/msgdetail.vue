<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab :key="0">详细</v-tab>
      <v-tab :key="1" :disabled="!showEdit">编辑</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="0">
        <v-card-text v-html="renderMarkdown(msg.content)" class="content"/>
        <v-card-text>
          <v-chip label v-for="(tag, i) in msg.tags" :key="i">
            {{ tag }}
          </v-chip>
        </v-card-text>
        <v-card-text>
          <v-chip outlined>
            <v-icon>publish</v-icon>
            {{ formatDate(msg.created) }}
          </v-chip>
          <v-chip outlined>
            <v-icon>mdi-email-edit</v-icon>
            {{ formatDate(msg.updated) }}
          </v-chip>
          <user-chip :id="msg.user"/>
        </v-card-text>
      </v-tab-item>
      <v-tab-item :key="1">
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
          <v-btn color="error" outlined @click="load" :disabled="loading">重置</v-btn>
          <v-btn color="primary" @click="submit" :loading="loading" :disabled="!id">提交</v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { msgs, editMsg } from '@/db/msg'
import { get } from '@/db/config'
import { formatDate } from '@/plugins/formatter'
import { renderMarkdown } from '@/plugins/marked'
import userChip from '@/components/userchip.vue'

export default {
  name: 'msgDetail',
  props: ['id'],
  components: {
    userChip
  },
  data: () => ({
    msg: {},
    content: '',
    tags: [],
    tab: 0,
    loading: false,
    showEdit: false
  }),
  methods: {
    async load () {
      const msg = await msgs.get(this.id)
      this.msg = msg
      this.content = msg.content
      this.tags = msg.tags
      const user = await get('current-user')
      this.showEdit = user === msg.user
    },
    submit () {
      this.loading = true
      editMsg(this.id, this.content, this.tags)
        .then(this.load)
        .then(() => this.$emit('update'))
        .finally(() => { this.loading = false })
    },
    formatDate,
    renderMarkdown
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>
.content {
  max-height: 600px;
  overflow: auto;
}
</style>
