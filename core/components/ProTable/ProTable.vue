<template>
  <div class="pro-table-container" :class="{ 'auto-fill': autoFill }">
    <div class="pro-table-top">
      <div class="pro-table-actionbar"></div>

      <div
        v-if="toolbar.value.show"
        class="pro-table-toolbar"
        :class="toolbar.value.class"
        :style="toolbar.value.style"
      >
        <a-space v-bind="toolbar.value.space">
          <template v-for="(item, i) in toolbar.value.actions">
            <div v-if="item.show" :key="i">
              <a-tooltip v-if="item.tooltip!.show" v-bind="item.tooltip">
                <pro-render
                  v-if="item.render"
                  :render="item.render"
                  :ctx="item.props"
                />
                <a-button v-else v-bind="item.props">
                  {{ item.props?.buttonText }}
                </a-button>
              </a-tooltip>

              <template v-else>
                <pro-render
                  v-if="item.render"
                  :render="item.render"
                  :ctx="item.props"
                />
                <a-button v-else v-bind="item.props">
                  {{ item.props?.buttonText }}
                </a-button>
              </template>
            </div>
          </template>
        </a-space>
      </div>
    </div>

    <a-form class="pro-table-edit-form" :model="editableTableData?.values">
      <a-table
        ref="tableRef"
        class="pro-table"
        :class="{ 'auto-fill': autoFill }"
        v-bind="tableProps.value"
        :loading="loading.value"
        :columns="resolvedColumns"
      >
        <template
          v-for="(render, name) in tableSlots"
          :key="name"
          #[name]="ctx"
        >
          <pro-render :render="render" :ctx="ctx" />
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { computed, inject } from 'vue'

import { ProTableRefKey } from './constant'

import type { ProTableProps } from './interface'

defineOptions({ name: 'ProTable' })

const p = defineProps<ProTableProps<T>>()

const resolvedColumns = computed(() => p.columns.map(c => c.value))

const tableRef = inject(ProTableRefKey)
</script>

<style scoped>
.pro-table-container.auto-fill {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pro-table-container.auto-fill .pro-table-edit-form {
  display: flex;
  overflow: auto;
  height: 100%;
  flex: 1;
  flex-direction: column;
}

.pro-table.auto-fill {
  display: flex;
  overflow: auto;
  height: 100%;
  flex: 1;
  flex-direction: column;
}

.pro-table.auto-fill :deep(> .ant-spin-nested-loading) {
  display: flex;
  overflow: auto;
  height: 100%;
  flex: 1;
  flex-direction: column;
}

.pro-table.auto-fill :deep(> .ant-spin-nested-loading > .ant-spin-container) {
  display: flex;
  overflow: auto;
  height: 100%;
  flex-direction: column;
  flex: 1;
}

.pro-table.auto-fill
  :deep(> .ant-spin-nested-loading > .ant-spin-container > .ant-table) {
  display: flex;
  overflow: auto;
  flex: 1;
  flex-direction: column;
}

.pro-table.auto-fill
  :deep(
    > .ant-spin-nested-loading
      > .ant-spin-container
      > .ant-table
      > .ant-table-container
  ) {
  display: flex;
  overflow: auto;
  height: 100%;
  flex-direction: column;
  flex: 1;
}

.pro-table.auto-fill
  :deep(
    > .ant-spin-nested-loading
      > .ant-spin-container
      > .ant-table
      > .ant-table-container
      > .ant-table-body
  ) {
  flex: 1;
}

.pro-table-top {
  display: flex;
  justify-content: space-between;
}

.pro-table-toolbar,
.pro-table-actionbar {
  margin-bottom: 16px;
}

.pro-pagination {
  margin-top: 16px;
}
</style>
