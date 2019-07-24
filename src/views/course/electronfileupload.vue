<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-tabs grow v-model="tab">
          <v-tab :key="0">上传文件</v-tab>
          <v-tab :key="1">上传文件夹</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <v-card-text>
              <v-text-field label="路径"/>
              <v-combobox label="标签" multiple chips/>
            </v-card-text>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-card-text>
              <v-text-field label="路径"/>
              <v-combobox label="标签" multiple chips/>
              <v-checkbox label="为可识别的课件自动添加公开保护版本"/>
            </v-card-text>
            <v-card-text class="logs">
              <pre></pre>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary">选择文件夹</v-btn>
            </v-card-actions>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'fileUpload',
  data: () => ({
    path: '/',
    tags: [],
    versions: [],
    tab: 0
  }),
  props: ['id'],
  methods: {
    provide () {
      //
    },
    create () {
      //
    }
  },
  created () {
    const query = this.$route.query
    this.path = query.path || '/'
    this.tab = +!!query.folder
  }
}
</script>

<style scoped>
.logs {
  max-height: 200px;
  overflow: auto;
}
</style>
