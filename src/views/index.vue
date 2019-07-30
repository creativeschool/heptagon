<template>
  <v-layout justify-space-around align-content-start wrap>
    <v-flex xs12 md12 lg6>
      <course-list/>
    </v-flex>
    <v-flex xs12 md12 lg6>
      <recent-msg/>
    </v-flex>
  </v-layout>
</template>

<script>
import { isLoggedIn } from '@/db/user'
import { bus } from '@/plugins/bus'
import courseList from '@/components/courselist.vue'
import recentMsg from '@/components/recentmsg.vue'

export default {
  name: 'home',
  components: {
    courseList,
    recentMsg
  },
  data: () => ({
  }),
  created () {
    this.loadLogin()
    bus.$emit('title', '')
  },
  methods: {
    async loadLogin () {
      if (!await isLoggedIn()) {
        this.$router.replace('/login')
      }
    }
  }
}
</script>
