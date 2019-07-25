<template>
  <v-tab-item>
    <v-card-text>
      <v-text-field label="路径" />
      <v-combobox label="标签" multiple chips />
      <v-checkbox label="为可识别的课件自动添加公开保护版本" />
    </v-card-text>
    <v-card-text class="logs">
      <pre></pre>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary">选择文件夹</v-btn>
    </v-card-actions>
  </v-tab-item>
</template>

<style scoped>
.logs {
  max-height: 200px;
  overflow: auto;
}
</style>
