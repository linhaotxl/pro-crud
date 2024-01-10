<template>
  <pro-table class="pro-table-07" v-bind="proTableBinding" />
</template>
<script lang="ts" setup>
import { useScrollbar } from 'use-scrollbars'
import { onMounted, ref } from 'vue'

import 'use-scrollbars/dist/style.css'

import { buildTable } from '~/components/ProTable'

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 1,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 2,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 3,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: 'John Brown',
    age: 4,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 5,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 6,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '7',
    name: 'John Brown',
    age: 7,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '8',
    name: 'Jim Green',
    age: 8,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '9',
    name: 'Joe Black',
    age: 9,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '10',
    name: 'John Brown',
    age: 10,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '11',
    name: 'Jim Green',
    age: 11,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '12',
    name: 'Joe Black',
    age: 12,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const nameColShow = ref(false)
const nameColLabel = ref('Name')
const ageKey = ref('age')

const { proTableBinding } = buildTable(scope => {
  onMounted(() => {
    const $table = scope.getTableRef().value
    const $container = $table.$el.querySelector('.ant-table-container')
    const $header = $table.$el.querySelector('.ant-table-header')

    const barStates = useScrollbar($container)

    barStates.setOffset({
      y: {
        top: $header,
      },
    })
  })

  return {
    columns: [
      {
        show: nameColShow,
        label: nameColLabel,
        name: 'name',
        key: 'name',
        columnProps: {
          resizable: true,
          width: 150,
        },
      },
      {
        label: 'Age',
        name: ageKey,
        key: 'age',
        columnProps: {
          resizable: true,
          width: 100,
          minWidth: 100,
          maxWidth: 200,
        },
      },
      {
        label: 'Address',
        name: 'address',
        key: 'address',
      },
      // {
      //   label: 'Tags',
      //   key: 'tags',
      //   name: 'tags',
      // },
      // {
      //   label: 'Action',
      //   key: 'action',
      // },
    ],

    data,

    toolbar: {
      actions: {
        toggleName: {
          tooltip: { title: '切换Name' },
          props: {
            shape: 'circle',
            onClick() {
              nameColShow.value = !nameColShow.value
              nameColLabel.value = `${nameColLabel.value}${nameColLabel.value}`
            },
          },
        },

        toggleAge: {
          tooltip: { title: '切换Age' },
          props: {
            shape: 'circle',
            onClick() {
              ageKey.value = ageKey.value === 'age' ? 'name' : ''
            },
          },
        },
      },
    },

    tableProps: {
      rowKey: 'key',
    },

    autoFill: true,
  }
})
</script>

<style scoped>
.pro-table-07 {
  height: 100%;
}

.pro-table-07 :deep(.ant-table-container) {
  position: relative;
}

.pro-table-07 :deep(.ant-table-body) {
  scrollbar-width: none;
}

.pro-table-07 :deep(.ant-table-body::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>
