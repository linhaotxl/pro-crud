<template>
  <div class="pro-crud">
    <pro-search
      v-if="searchShow.value"
      ref="proSearchRef"
      v-bind="searchBinding"
    />

    <pro-table
      v-if="tableShow.value"
      ref="proTableRef"
      class="pro-crud-table"
      v-bind="tableBinding"
    />

    <pro-dialog
      v-if="modalShow?.value"
      :key="modalType.value"
      :dialog-props="modalProps?.value"
      :form-props="modalFormProps.value"
    />
  </div>
</template>

<script
  lang="ts"
  setup
  generic=" T extends object,
S extends object,
A extends object,
E extends object"
>
import { inject } from 'vue'

import { ProSearchRef, ProTableRef } from './constant'

import { ProDialog } from '../ProDialog'

import type { ProCrudProps } from './interface'

defineOptions({ name: 'ProCrud' })

const proSearchRef = inject(ProSearchRef)
const proTableRef = inject(ProTableRef)

defineProps<ProCrudProps<T, S, A, E>>()
</script>

<style scoped>
.pro-crud {
  display: flex;
  flex-direction: column;
}

.pro-crud-table {
  flex: 1;
  overflow: auto;
}
</style>
