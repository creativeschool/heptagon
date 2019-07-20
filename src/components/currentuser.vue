<template>
  <v-menu offset-y :disabled="!user">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" style="-webkit-app-region: no-drag" class="mr-2">
        {{ user ? user.name : '未登录' }}
      </v-btn>
    </template>
    <v-card v-if="!!user">
      <v-img width="240px" height="64px" :src="`https://ui-avatars.com/api/?name=${user.name}&size=256`">
      </v-img>
      <v-card-title>
        {{ user.name }}
        <v-spacer/>
        <v-btn icon to="/profile">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip v-for="(tag, i) in user.tags" :key="i">{{ tag }}</v-chip>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { get } from '@/db/config'
import { getUser } from '@/db/user'
import { bus } from '@/plugins/bus'

export default {
  name: 'currentUser',
  data: () => ({
    user: null
  }),
  mounted () {
    this.load()
    bus.$on('chrome_update', () => this.load())
  },
  methods: {
    async load () {
      const _id = await get('current-user')
      if (!_id) {
        this.user = null
        return
      }
      this.user = await getUser(_id)
    }
  }
}
</script>
