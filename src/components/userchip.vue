<template>
  <v-chip :color="color" outlined>
    <v-icon>mdi-account</v-icon>
    {{ user.name }}
  </v-chip>
</template>

<script>
import { users, syncUser } from '../db/user'
export default {
  name: 'userChip',
  data: () => ({
    user: {},
    color: 'primary'
  }),
  props: ['id'],
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
      const user = await users.get(this.id)
      if (!user) {
        try {
          await syncUser(this.id)
          this.user = await users.get(this.id)
        } catch (e) {
          this.user.name = '无此用户'
          this.color = 'grey'
        }
      } else {
        this.user = user
      }
    }
  }
}
</script>
