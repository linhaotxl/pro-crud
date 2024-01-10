<template>
  <pro-crud ref="proCrudRef" class="pro-crud-07" v-bind="proCrudBinding" />
</template>

<script lang="tsx" setup>
import { useScrollbar } from 'use-scrollbars'
import { onMounted } from 'vue'

import { buildCrud } from '~/index'

const { proCrudBinding, proCrudRef } = buildCrud(scope => {
  onMounted(() => {
    const $table = scope.table.getTableRef().value
    const $container = $table.$el.querySelector('.ant-table-container')
    const $header = $table.$el.querySelector('.ant-table-header')

    console.log(1, $container, $header)

    const barStates = useScrollbar($container)

    barStates.setOffset({
      y: {
        top: $header,
      },
    })
  })

  return {
    async fetchDictCollection() {
      // debugger
      console.log(888)
      return {
        position: [
          { addr: '室内', position: 1 },
          { addr: '室外', position: 2 },
        ],
      }
    },
    columns: [
      {
        label: '摄像机名称',
        name: 'cameraName',
        search: { show: true },
      },

      {
        label: '摄像机编号',
        name: 'number',
        search: { show: true },
      },

      {
        label: '摄像机位置',
        name: 'addr',
        type: 'dict-select',
        search: { show: false },
        dict: {
          useCollect(dictSet) {
            console.log(111, dictSet.position)
            return dictSet.position
          },
          labelField: 'addr',
          valueField: 'position',
        },
      },

      {
        label: '摄像机名IP',
        name: 'ip',
        search: { show: false },
      },

      {
        label: '摄像机端口',
        name: 'port',
        search: { show: false },
      },

      {
        label: '主码流',
        name: 'mainStream',
        search: { show: false },
      },

      {
        label: '副码流',
        name: 'deputyStream',
        search: { show: false },
      },

      {
        label: '摄像机状态',
        name: 'status',
        type: 'dict-select',
        search: { show: true },
        dict: {
          data: [],
        },
      },

      {
        label: '录像机类型',
        name: 'type',
        type: 'dict-select',
        search: { show: true },
        dict: {
          data: [],
        },
      },

      {
        label: 'X坐标(3D)',
        name: 'x3',
        search: { show: false },
        table: { show: false },
      },

      {
        label: 'Y坐标(3D)',
        name: 'y3',
        search: { show: false },
        table: { show: false },
      },

      {
        label: 'Z坐标(3D)',
        name: 'z3',
        search: { show: false },
        table: { show: false },
      },

      {
        label: '用户名',
        name: 'userName',
        search: { show: false },
      },

      {
        label: '密码',
        name: 'password',
        search: { show: false },
      },

      {
        label: '摄像机通道',
        name: 'channelInfo',
        search: { show: false },
        table: { show: false },
      },

      {
        label: '录像机通道',
        name: 'videoAisle',
        search: { show: false },
        table: { show: false },
      },
    ],

    fetchPaginationData: async () => {
      return {
        total: 2,
        rows: [
          {
            cameraId: 69,
            number: 'jk_sn_104',
            cameraName: '研学中心一楼大厅东南',
            addr: 1,
            aisle: '主通道-1',
            type: '半球形摄像机',
            status: '可用',
            x3: '-13480.219',
            y3: '-10339.43',
            z3: '53.072',
            x2: null,
            y2: null,
            areaType: '室内',
            userName: 'admin',
            password: 'admin123',
            ip: '192.168.110.36',
            port: '37777',
            mainStream: '0',
            deputyStream: '1',
            mappingIp: null,
            mappingPort: null,
            videoAisle: '主通道-27',
          },
          // {
          //   cameraId: 68,
          //   number: 'jk_sn_102',
          //   cameraName: '研学中心一楼北侧走廊西',
          //   addr: 2,
          //   aisle: '主通道-1',
          //   type: '半球形摄像机',
          //   status: '可用',
          //   x3: '-14680.219',
          //   y3: '-10839.43',
          //   z3: '53.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室内',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.35',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '主通道-26',
          // },
          // {
          //   cameraId: 67,
          //   number: 'jk_sn_101',
          //   cameraName: '研学中心一楼大厅西南',
          //   addr: '研学楼',
          //   aisle: '主通道-1',
          //   type: '半球形摄像机',
          //   status: '可用',
          //   x3: '-14580.219',
          //   y3: '-10339.43',
          //   z3: '153.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室内',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.29',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '主通道-20',
          // },
          // {
          //   cameraId: 66,
          //   number: 'jk_sn_100',
          //   cameraName: '研学中心一楼大厅',
          //   addr: '研学楼',
          //   aisle: '主通道-1',
          //   type: '半球形摄像机',
          //   status: '可用',
          //   x3: '-14180.219',
          //   y3: '-10639.43',
          //   z3: '3.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室内',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.28',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '主通道-19',
          // },
          // {
          //   cameraId: 64,
          //   number: 'jk_sw_060',
          //   cameraName: '北区研学楼东南1',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '半球形摄像机',
          //   status: '可用',
          //   x3: '-9580.219',
          //   y3: '-9639.43',
          //   z3: '1303.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.11',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '通道-2',
          // },
          // {
          //   cameraId: 63,
          //   number: 'jk_sw_059',
          //   cameraName: '北区研学楼东南2',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '球形摄像机',
          //   status: '可用',
          //   x3: '-9480.406',
          //   y3: '-9800',
          //   z3: '1303.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.12',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '主通道-3',
          // },
          // {
          //   cameraId: 62,
          //   number: 'jk_sw_058',
          //   cameraName: '北区研学楼西北2',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '球形摄像机',
          //   status: '可用',
          //   x3: '-15500.094',
          //   y3: '-11925.547',
          //   z3: '1153.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.14',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '通道-5',
          // },
          // {
          //   cameraId: 61,
          //   number: 'jk_sw_057',
          //   cameraName: '研学楼西北1',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '球形摄像机',
          //   status: '可用',
          //   x3: '-15628.188',
          //   y3: '-11800.102',
          //   z3: '1153.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.13',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '通道-4',
          // },
          // {
          //   cameraId: 60,
          //   number: 'jk_sw_056',
          //   cameraName: '北区研学楼西南',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '球形摄像机',
          //   status: '可用',
          //   x3: '-16718.562',
          //   y3: '-9786.16',
          //   z3: '1553.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.15',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '通道-6',
          // },
          // {
          //   cameraId: 59,
          //   number: 'jk_sw_055',
          //   cameraName: '北区综合楼正门',
          //   addr: '北区',
          //   aisle: '主通道-1',
          //   type: '球形摄像机',
          //   status: '可用',
          //   x3: '-22680.344',
          //   y3: '-7248.457',
          //   z3: '803.072',
          //   x2: null,
          //   y2: null,
          //   areaType: '室外',
          //   userName: 'admin',
          //   password: 'admin123',
          //   ip: '192.168.110.16',
          //   port: '37777',
          //   mainStream: '0',
          //   deputyStream: '1',
          //   mappingIp: null,
          //   mappingPort: null,
          //   videoAisle: '通道-7',
          // },
        ],
        code: 200,
        msg: '查询成功',
      }
    },
    // deleteRequest: row =>
    //   removeCamera({ body: { cameraIds: [row.cameraId] } }),
    // addRequest: form => createCamera({ body: form }),

    operates: {
      buttons: {
        view: { show: false },
      },
    },

    table: {
      autoFill: true,
    },
  }
})
</script>

<style scoped>
.pro-crud-07 {
  height: 100%;
}

.pro-crud-07 :deep(.ant-table-container) {
  position: relative;
}

.pro-crud-07 :deep(.ant-table-body::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>
