import { merge } from 'lodash-es'
import { toValue, type MaybeRef } from 'vue'

import { DefaultProProColumn } from './constant'

import { ValueTypeMap, unRef } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
} from './interface'
import type { ValueType, useDictionary } from '../common'
import type { ColProps, FormItemProps } from 'ant-design-vue'
import type { ComputedRef } from 'vue'

export function buildFormColumn<T extends object>(
  col: MaybeRef<ColProps> | undefined,
  resolvedColumnsMap:
    | Map<FormItemProps['name'], InternalProFormColumnOptions<T>>
    | undefined,
  column: ProFormColumnOptions<T>,
  resolvedDictionary: ReturnType<typeof useDictionary> | undefined,
  children: ComputedRef<InternalProFormColumnOptions<T>>[] = []
) {
  // 合并默认 Column 配置
  const mergeColumn: ProFormColumnOptions<T> = merge(
    { col: { ...unRef(col) }, ...DefaultProProColumn },
    column
  )

  // 解析 type 类型
  const resolvedType: ValueType = unRef(mergeColumn.type)

  const name = toValue(mergeColumn.name)

  // @ts-ignore
  const resolvedColumn: InternalProFormColumnOptions<T> = {
    type: resolvedType,
    resolvedKey: Array.isArray(name) ? name.join('.') : name,
    resolvedProps: merge(
      {},
      ValueTypeMap.value[resolvedType].form?.props,
      mergeColumn.fieldProps
    ),
    itemProps: { name },
  }

  type Keys = keyof typeof mergeColumn
  ;(Object.keys(mergeColumn) as Keys[]).forEach(key => {
    switch (key) {
      case 'dict':
        resolvedColumn.dict = resolvedDictionary
        break

      case 'children':
        resolvedColumn.children = children
        break

      case 'tooltip':
        resolvedColumn.tooltip =
          typeof mergeColumn.tooltip === 'string'
            ? { title: mergeColumn.tooltip }
            : mergeColumn.tooltip
        break

      case 'fieldProps':
      case 'itemProps':
        Object.keys(mergeColumn[key]).forEach(k => {
          ;(resolvedColumn[key] ||= {})[k] = unRef(mergeColumn[key][k])
        })
        break

      default:
        resolvedColumn[key] = unRef(mergeColumn[key])
    }
  })

  if (resolvedColumnsMap) {
    resolvedColumnsMap.set(name, resolvedColumn)
  }

  return resolvedColumn
}
