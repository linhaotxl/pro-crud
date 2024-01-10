import { Input } from 'ant-design-vue'
import { createApp } from 'vue'

import './index.css'
import App from './App.vue'
import BasicDialog from './components/BasicDialog.vue'
import BasicInfo from './components/BasicInfo.vue'
import { router } from './routes'

import { ProComponents } from '~/index'

import 'use-scrollbars/dist/style.css'

const app = createApp(App)

app.component(BasicDialog.name, BasicDialog)
app.component(BasicInfo.name, BasicInfo)

// app.use(ElementPlus, {})

app.use(ProComponents, {
  types: {
    info: {
      form: {
        is: 'basic-info',
      },
    },

    nickname: {
      form: {
        render: ({ vModel }) => {
          return <Input v-model:value={vModel.value} />
        },
      },
    },
  },

  transformResponse(ctx) {
    const { response } = ctx

    return {
      total: response.total,
      data: response.rows,
    }
  },

  transformQuery(ctx) {
    const {
      query: {
        page: { pageNumber, pageSize },
      },
      form,
    } = ctx
    return { query: { pageSize, pageNumber, ...form } }
  },
})

app.use(router)

app.mount('#app')
