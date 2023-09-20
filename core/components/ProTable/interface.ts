import type {
  ValueType,
  DictionaryOption,
  ResolvedColumnDict,
  ColumnType,
  DictionaryCollectionOptions,
} from '../common'
import type { ExtractMaybeRef, JSXElement, MaybeRef } from '../common/interface'
import type { ActionOption, ActionsList } from '../ProButton'
import type { SuccessToastOptions } from '../Toast'
import type {
  ButtonProps,
  ModalProps,
  PopconfirmProps,
  SpaceProps,
  SpinProps,
  TableProps,
  TooltipProps,
} from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { SizeType } from 'ant-design-vue/es/config-provider'
import type {
  FilterDropdownProps,
  FilterValue,
  SorterResult,
} from 'ant-design-vue/es/table/interface'
import type {
  DataIndex,
  ExpandedRowRender,
} from 'ant-design-vue/es/vc-table/interface'
import type { CSSProperties, ComputedRef, Ref } from 'vue'

/**
 * ProTable 接受的 props
 */
export type ProTableProps<T extends object> = BuildProTableBinding<T>

/**
 * 获取数据函数
 */
export type FetchTableListRequest<T extends object, P extends object> = (
  query: FetchTableListQuery<T, P>
) => Promise<FetchTableDataResult<T>> | FetchTableDataResult<T>

/**
 * 获取数据函数参数
 */
export type FetchTableListQuery<T, P extends object> = {
  page: { pageNumber: number; pageSize: number }
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<T> | SorterResult<T>[]
  params?: P
}

/**
 * 分页获取数据函数返回值
 */
export type FetchTableDataResult<T> = {
  data: T[]
  total: number
}

/**
 * headerCell 插槽参数
 */
export type HeaderCellSlotParams<T> = { column: ColumnType<T>; title: string }

/**
 * bodyCell 插槽参数
 */
export type BodyCellSlotParams<T> = {
  text: any
  index: number
  column: ColumnType<T>
  record: T
  editable: boolean
}

/**
 * ProTable 组件实例方法
 */
export type ProTableInstance<T> = ProTableScope<T>

/**
 * 列配置
 */
export type ProTableColumnProps<T> = {
  /**
   * 列配置
   */
  columnProps?: MaybeRef<
    ExtractMaybeRef<Omit<ColumnType<T>, 'title' | 'dataIndex' | 'key'>>
  >

  /**
   * 分组列配置
   */
  children?: ProTableColumnProps<T> | ProTableColumnProps<T>[]

  /**
   * 列插槽
   */
  columnSlots?: ProTableColumnSlots<T>

  /**
   * 唯一索引
   */
  key?: MaybeRef<string>

  /**
   * 标题
   */
  label?: MaybeRef<string>

  /**
   * 字段名
   */
  name?: MaybeRef<DataIndex>

  /**
   * 是否显示列
   */
  show?: MaybeRef<boolean>

  /**
   * 类型
   *
   * @default 'text'
   */
  type?: MaybeRef<ValueType | any>

  /**
   * 字典配置
   */
  dict?: DictionaryOption

  /**
   * 是否渲染单元格
   */
  renderCell?: boolean

  /**
   * 编辑配置
   */
  editable?: ProTableColumnEditable<T>
}

/**
 * 操作列配置
 */
export type ProTableActionColumnProps<T> = Omit<
  ProTableColumnProps<T>,
  'type' | 'dict' | 'editable'
> & {
  /**
   * 操作按钮组
   */
  actions?: ActionsList<ProTableActions<T>>
}

export type ProTableActions<T> = Record<string, ProTableActionProps<T>>

/**
 * 操作列按钮配置
 */
export interface ProTableActionProps<T>
  extends Omit<ActionOption, 'props' | 'confirmProps'> {
  /**
   * 按钮 props
   */
  props?: Omit<ButtonProps, 'onClick'> & {
    onClick?: (e: MouseEvent, ctx: BodyCellSlotParams<T>) => void
  }

  /**
   * 确认弹窗 props
   */
  confirmProps?: ProTableActionConfirmProps<T> | ProTableActionModalProps<T>
}

/**
 * Popconfirm props，onConfirm 事件多了一个参数：行数据
 */
export type ProTableActionConfirmProps<T> = Omit<
  PopconfirmProps,
  'onConfirm'
> & {
  onConfirm?(e: MouseEvent, ctx: BodyCellSlotParams<T>): void
}

/**
 * MessageBox props，callback 多了一个参数：行数据
 */
export type ProTableActionModalProps<T> = Omit<ModalProps, 'onOk'> & {
  onOk?(ctx: BodyCellSlotParams<T>): void
}

export type ProTableColumnEditable<T> =
  | false
  | ((ctx: BodyCellSlotParams<T>) => boolean)

/**
 * 列插槽
 */
export type ProTableColumnSlots<T> = {
  headerCell?(ctx: HeaderCellSlotParams<T>): JSXElement
  bodyCell?(ctx: BodyCellSlotParams<T>): JSXElement
}

/**
 * @internal
 */
export interface InternalProTableColumnProps<T> {
  name: DataIndex | undefined
  type: ValueType | any
  dict?: ResolvedColumnDict
  renderCell?: boolean
  editable?: ProTableColumnEditable<T>
  columnProps: ColumnType<T>
  columnSlots?: ProTableColumnSlots<T> | undefined
}

/**
 * buildTable 返回值
 */
export type BuildProTableResult<T extends object> = {
  proTableRef: Ref<ProTableInstance<T> | null>
  proTableBinding: BuildProTableBinding<T>
}

/**
 * buildTable option 返回值
 */
export type BuildProTableOptionResult<
  T extends object,
  P extends object
> = DictionaryCollectionOptions & {
  /**
   * 数据源(不推荐)
   */
  data?: MaybeRef<T[]>

  /**
   * 默认数据源
   */
  defaultData?: T[]

  /**
   * Table props
   */
  tableProps?: MaybeRef<ExtractMaybeRef<TableProps>>

  /**
   * 初始页数
   *
   * @default 1
   */
  initialPageNumber?: number

  /**
   * Table 插槽
   */
  tableSlots?: TableSlots<T>

  /**
   * 列配置
   */
  columns?: ProTableColumnProps<T>[]

  /**
   * 操作列配置
   */
  action?: ProTableActionColumnProps<T>

  /**
   * loading 配置
   */
  loading?: MaybeRef<ExtractMaybeRef<Omit<SpinProps, 'spinning'>>>

  /**
   * toolbar 配置
   */
  toolbar?: ProTableToolbarOption

  /**
   * 请求携带的额外参数，当发生变化时会自动查询
   */
  params?: MaybeRef<P>

  /**
   * 是否需要首次触发请求
   *
   * @default true
   */
  immediate?: boolean

  /**
   * 编辑配置
   */
  editable?: ProTableEditable<T>

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<T, P>

  /**
   * 处理请求的数据
   */
  postData?: (data: T[]) => T[]

  /**
   * 提交编辑行内容
   */
  submitEditable?: (
    values: T,
    ctx: BodyCellSlotParams<T>
  ) => Promise<boolean> | boolean

  /**
   * table 尺寸发生改变
   */
  onSizeChange?: (size: SizeType) => void

  /**
   * loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean) => void

  /**
   * 数据加载完成后触发,会多次触发
   */
  onLoad?: (dataSource: T[]) => void

  /**
   * Table 的数据发生改变时触发
   */
  onDataSourceChange?: (dataSource: T[]) => void

  /**
   * 数据加载失败时触发
   */
  onRequestError?: (error: any) => void
}

export type ProTableEditable<T> = false | ProTableEditableOptions<T>

/**
 * ProTable 编辑配置
 */
export interface ProTableEditableOptions<T> {
  type?: 'cell' | 'single' | 'multiple'

  /**
   * 编辑模式下的操作
   */
  actions?: ActionsList<ProTableEditableActions<T>>

  /**
   * 编辑成功提示
   *
   * @default '编辑成功'
   */
  toast?: SuccessToastOptions
}

/**
 * 编辑模式下操作
 */
export interface ProTableEditableActions<T> {
  /**
   * 确认按钮配置
   */
  ok?: ProTableActionProps<T>

  /**
   * 取消按钮配置
   */
  cancel?: ProTableActionProps<T>
}

export interface ProvideEditTableOptions<T> extends ProTableEditableOptions<T> {
  editRowKeys: Ref<Key[]>
  values: Record<string, any>

  getRowKey(
    record: T
    // index: number,
    // rowKey?: Key | GetRowKey<T> | undefined
  ): Key
}

/**
 * buildTable 返回需要绑定的 props
 */
export interface BuildProTableBinding<T extends object> {
  tableProps: ComputedRef<TableProps<T>>
  tableSlots: InternalTableSlots<T>
  loading: ComputedRef<SpinProps>
  columns: ComputedRef<ColumnType<T>[]>
  scope: ProTableScope<T>
  toolbar: ComputedRef<InternalProTableToolbarOption>
  editableTableData: ProvideEditTableOptions<T> | undefined
}

/**
 * ProTable 作用域
 */
export interface ProTableScope<T> {
  /**
   * 重新加载指定页数数据，默认加载当前页数
   */
  reload(): Promise<void>

  /**
   * 恢复默认页重新加载
   */
  reset(): Promise<void>

  /**
   * 跳转上一页
   */
  previous(): Promise<void>

  /**
   * 加载下一页
   */
  next(): Promise<void>

  /**
   * 开始编辑
   *
   * @param rowKey 需要编辑的行 id，使用 rowKey
   */
  startEditable(rowKey: Key): void

  /**
   * 取消编辑
   *
   * @param rowKey 需要编辑的行 id，使用 rowKey
   */
  cancelEditable(rowKey: Key): void

  /**
   * 检测是否处于编辑状态
   * @param rowKey
   * @param columnName
   */
  validateEditable(rowKey: Key): boolean

  /**
   * 获取行数据
   * @param rowKey
   */
  getRowData(rowKey: Key): T | undefined

  /**
   * 设置行数据
   * @param rowKey
   * @param data
   */
  setRowData(rowKey: Key, data: Partial<T>): void
}

/**
 * Table 插槽
 */
export interface TableSlots<T> {
  summary?(): JSXElement
  title?(data: T[]): JSXElement
  footer?(data: T[]): JSXElement
  expandColumnTitle?(): JSXElement
  expandedRowRender?(ctx: Parameters<ExpandedRowRender<T>>[0]): JSXElement
  customFilterDropdown?(ctx: FilterDropdownProps<T>): JSXElement
  customFilterIcon?(ctx: {
    filtered: boolean
    column: ColumnType<T>
  }): JSXElement
}

/**
 * @internal
 */
export interface InternalTableSlots<T> extends TableSlots<T> {
  headerCell?(ctx: HeaderCellSlotParams<T>): JSXElement
  bodyCell?(ctx: BodyCellSlotParams<T>): JSXElement
}

/**
 * toolbar 配置
 */
export interface ProTableToolbarOption<T = object> {
  /**
   * 是否显示
   */
  show?: MaybeRef<boolean>

  /**
   * 间距配置
   */
  space?: MaybeRef<SpaceProps>

  /**
   * 操作列表
   */
  actions?: ProTableToolbarActions<T>
}

export type ProTableToolbarActions<T> = {
  /**
   * 刷新按钮
   */
  reload?: ToolbarOption

  /**
   * 导出按钮
   */
  export?: ToolbarOption

  /**
   * 密度按钮
   */
  density?: ToolbarOption

  /**
   * 设置按钮
   */
  settings?: ToolbarOption

  /**
   * 其他
   */
  [type: string]: ToolbarOption | undefined
} & T

/**
 * toolbar 按钮配置
 */
export interface ToolbarOption {
  /**
   * 是否显示操作
   */
  show?: MaybeRef<boolean>

  /**
   * toolbar className
   */
  class?: MaybeRef<string | string[] | Record<string, boolean>>

  /**
   * toolbar 样式
   */
  style?: MaybeRef<string | CSSProperties>

  /**
   * 优先级，越高越靠前
   */
  order?: MaybeRef<number>

  /**
   * button 配置
   */
  props?: ButtonProps

  /**
   * 提示 配置
   */
  tooltip?: ToolbarOptionTooltip

  /**
   * 自定义渲染操作
   */
  render?: (buttonProps: ButtonProps) => JSX.Element
}

/**
 * toolbar 按钮 tooltip 配置
 */
export interface ToolbarOptionTooltip extends TooltipProps {
  show?: MaybeRef<boolean>
}

export interface InternalProTableToolbarOption {
  show: boolean
  actions: ToolbarOption[]
  style?: string | CSSProperties
  class?: string | string[] | Record<string, boolean>
  tooltip?: TooltipProps
  space: SpaceProps
}
