<template>
  <v-chip :color="color" outlined @click="$router.push('/course/' + id)">
    <v-icon left>mdi-book-open-outline</v-icon>
    {{ course.name }}
  </v-chip>
</template>

<script>
import { courses, syncCourse } from '@/db/course'

export default {
  name: 'userChip',
  data: () => ({
    course: {},
    color: 'green'
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
      if (!this.id) {
        this.course.name = '加载中'
        this.color = 'grey'
        return
      }
      const course = await courses.get(this.id)
      if (!course) {
        try {
          await syncCourse(this.id)
          this.course = await courses.get(this.id)
          this.color = 'primary'
        } catch (e) {
          this.course.name = '无此课程'
          this.color = 'grey'
        }
      } else {
        this.course = course
        this.color = 'green'
      }
    }
  }
}
</script>
