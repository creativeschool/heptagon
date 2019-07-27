<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-tabs grow v-model="tab">
          <v-tab :key="0">上传文件</v-tab>
          <!-- <v-tab :key="1">上传文件夹</v-tab> -->
        </v-tabs>
        <v-tabs-items v-model="tab">
          <file-upload :key="0" :id="id"/>
          <!-- <folder-upload :key="1" :id="id"/> -->
        </v-tabs-items>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import fileUpload from '@/components/fileupload.vue'
import folderUpload from '@/components/folderupload.vue'
import { bus } from '@/plugins/bus'

export default {
  name: 'upload',
  components: {
    fileUpload,
    // eslint-disable-next-line vue/no-unused-components
    folderUpload
  },
  props: ['id'],
  data: () => ({
    tab: 0
  }),
  created () {
    const query = this.$route.query
    this.tab = +!!query.folder
    bus.$emit('title', '文件上传')
  }
}
</script>

<style scoped>
.logs {
  max-height: 200px;
  overflow: auto;
}
</style>
