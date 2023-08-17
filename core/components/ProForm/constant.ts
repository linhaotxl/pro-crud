import type { ProFormColumnOptions } from './interface'
import type { ValueType, ElColProps, ElRowProps } from '../common'
import type { FormItemInstance } from 'ant-design-vue'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { InjectionKey, Ref } from 'vue'

// 默认显示按钮组按钮
export const ShowButton = true

// 默认表单类型为 text
export const DefaultFormFieldType: ValueType = 'text'

// 删除表单是否保留字段
export const DefaultPreserve = true

// 默认行配置
export const DefaultRow: ElRowProps = {}

// 默认列配置
export const DefaultCol: ElColProps = { span: 24 }

// 注入 FormItemRefs 的 key
export const FormItemRefKey = Symbol() as InjectionKey<
  Map<NamePath, Ref<FormItemInstance | null>>
>

export const ProFormInstanceNames = [
  'submit',
  'reset',
  'resetFields',
  'setFieldValue',
  'setFieldValues',
  'setFieldValuesTransform',
  'getFieldValue',
  'removeFields',
  'validate',
  'validateField',
  'scrollToField',
  'clearValidate',
  'getFieldInstance',
  'getFormValues',
] as const

export const DefaultProProColumn: ProFormColumnOptions<any> = {
  show: true,
  preserve: true,
  type: 'text',
  submitted: true,
  fill: true,
}
