import { ConfigProvider, FormItem, type SpaceProps } from 'ant-design-vue'
import { h, inject, resolveComponent } from 'vue'

import { type ValueType, genToast } from '../common'
import { buildFormColumn } from '../ProForm'

import { GlobalOption } from '~/constant'

import type {
  ProTableActionProps,
  ProTableColumnSlots,
  ProvideEditTableOptions,
  ToolbarOption,
} from './interface'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import type { InjectionKey } from 'vue'

export const DefaultPageNumber = 1
export const DefaultPageSize = 10

// 默认 toolbar 按钮配置
export const DefaultToolbarTooltip: ToolbarOption = {
  show: true,
  order: 1,
  tooltip: { placement: 'top', show: true },
  props: {
    type: 'primary',
    shape: 'circle',
  },
}

// toolbar 默认间距配置
export const DefaultToolbarSpace: SpaceProps = { size: 16 }

// toolbar 密度枚举
export const enum ToolbarDensityEnum {
  Large = 'large',
  Default = 'middle',
  Small = 'small',
}

// 表格默认大小
export const DefaultTableSize = 'large'

// 默认显示表格列
export const DefaultTableColumnShow = true

export const DefaultColumnType: ValueType = 'text'

export const EditableTableData = Symbol() as InjectionKey<
  ProvideEditTableOptions<any> | undefined
>

const EditableTableCellTheme: ThemeConfig = {
  token: { marginLG: 0, marginXS: 0, marginXXS: 0 },
}

export function injectValueTypeTableCell(
  valueType: ValueType
): ProTableColumnSlots<any>['bodyCell'] {
  return ctx => {
    const editableData = inject(EditableTableData)

    if (editableData) {
      const { name, editable } = ctx.column.__column!
      let rowKey: Key

      const isEditable =
        editable === false
          ? false
          : typeof editable === 'function'
          ? editable(ctx)
          : true

      if (
        isEditable &&
        name &&
        editableData.editRowKeys.value.includes(
          (rowKey = editableData.getRowKey(ctx.record))
        )
      ) {
        const resolvedName = [rowKey]
        if (Array.isArray(name)) resolvedName.push(...name)
        else if (name) resolvedName.push(name as string | number)

        const { dict, type } = ctx.column.__column!
        const column = {
          name: resolvedName,
          show: true,
          type,
        }
        const internalColumn = buildFormColumn(
          undefined,
          undefined,
          column,
          dict
        )

        return (
          <ConfigProvider theme={EditableTableCellTheme}>
            <FormItem name={resolvedName}></FormItem>
          </ConfigProvider>
        )
      }
    }

    const defaultTableType = inject(GlobalOption)?.types[valueType]?.table
    if (defaultTableType) {
      const { is: Comp, props, render } = defaultTableType
      if (Comp) {
        return h(resolveComponent(Comp), { ...props, ctx })
      } else if (render) {
        return render(ctx)
      }
    }

    return null
  }
}

export const DefaultActionColumn: ProTableActionProps<any> = {
  show: true,
  order: 1,
  confirmType: false,
}

export const EditSuccessToast = genToast('编辑成功')

export const ProTableRefKey = Symbol() as InjectionKey<any>
