<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 md6 lg4 class="pa-2">
      <v-card>
        <v-card-title>基本信息</v-card-title>
        <v-card-text>
          <v-text-field type="email" label="邮箱"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" outlined>重置</v-btn>
          <v-btn color="primary">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 md6 lg4 class="pa-2">
      <v-card>
        <v-card-title>修改密码</v-card-title>
        <v-card-text>
          <v-text-field type="password" label="原密码"/>
          <v-text-field type="password" label="新密码"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
