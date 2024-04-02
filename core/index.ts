import {
  Form,
  Row,
  Col,
  Tooltip,
  Input,
  Select,
  InputNumber,
  Slider,
  Switch,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Cascader,
  Table,
  Dropdown,
  Menu,
  Tag,
  Spin,
  Modal,
  ConfigProvider,
} from 'ant-design-vue'
import { merge } from 'lodash-es'

import { DefaultValueType } from './components/common'
import { ProCrud } from './components/ProCrud'
import { ProDictionary, ProSelect } from './components/ProDictionary'
import { ProForm, ProFormList } from './components/ProForm'
import { ProRender } from './components/ProRender'
import { ProTable } from './components/ProTable'
import { GlobalOption } from './constant'

import type {
  ProComponentsOptions,
  ResolvedProComponentsOptions,
} from './interface'
import type { Plugin } from 'vue'

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app, options) {
    app.component(ProCrud.name, ProCrud)
    app.component(ProTable.name, ProTable)
    app.component(ProRender.name, ProRender)
    app.component(ProForm.name, ProForm)
    app.component(ProSelect.name, ProSelect)
    app.component(ProDictionary.name, ProDictionary)
    app.component(ProFormList.name, ProFormList)

    app
      .use(Form)
      .use(Input)
      .use(Col)
      .use(Row)
      .use(Tooltip)
      .use(Select)
      .use(InputNumber)
      .use(Slider)
      .use(Switch)
      .use(DatePicker)
      .use(TimePicker)
      .use(Button)
      .use(Space)
      .use(Cascader)
      .use(Table)
      .use(Dropdown)
      .use(Menu)
      .use(Tag)
      .use(Spin)
      .use(Modal)
      .use(ConfigProvider)

    const resolvedProComponentOptions: ResolvedProComponentsOptions = merge(
      {},
      { types: DefaultValueType },
      options
    )

    app.provide(GlobalOption, resolvedProComponentOptions)
  },
}

export * from './components/ProForm'
export * from './components/ProCrud'
export * from './components/ProTable'
