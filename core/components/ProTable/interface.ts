// import type {
//   ValueType,
//   ColumnType,
//   DictionaryCollectionOptions,
//   ColumnDictionaryOptions,
//   useDictionary,
// } from '../common'
// import type { ExtractMaybeRef, JSXElement, MaybeRef } from '../common/interface'
// import type { ActionOption, ActionsList } from '../ProButton'
// import type { SuccessToastOptions } from '../Toast'
// import type {
//   ButtonProps,
//   ModalProps,
//   PopconfirmProps,
//   SpaceProps,
//   SpinProps,
//   TableProps,
//   TooltipProps,
// } from 'ant-design-vue'
// import type { Key } from 'ant-design-vue/es/_util/type'
// import type { SizeType } from 'ant-design-vue/es/config-provider'
// import type {
//   FilterDropdownProps,
//   FilterValue,
//   SorterResult,
// } from 'ant-design-vue/es/table/interface'
// import type {
//   DataIndex,
//   ExpandedRowRender,
// } from 'ant-design-vue/es/vc-table/interface'
// import type { CSSProperties, ComputedRef, Ref, VNode } from 'vue'

import { ActionOption } from '../ProButton'

import type { ExtractMaybeRef, MaybeRef, NamePath, ValueType } from '../common'
import type { ActionGroupOption, CustomActions } from '../ProButton'
import type { DictionaryCollection, DictionaryColumn } from '../ProDictionary'
import type { BuildFormOptionResult, ProFormScope } from '../ProForm'
import type {
  ButtonProps,
  SpaceProps,
  SpinProps,
  TableProps,
  TooltipProps,
} from 'ant-design-vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type {
  DataIndex,
  ExpandedRowRender,
} from 'ant-design-vue/es/vc-table/interface'
import type { VNodeChild } from 'vue'

// /**
//  * ProTable 接受的 props
//  */
// export type ProTableProps<T extends object> = BuildProTableBinding<T>

/**
 * 获取 Pro Table 数据函数
 */
export type FetchTableListRequest<Data = any> = () =>
  | Promise<Data[] | FetchProTablePageListResult<Data>>
  | FetchProTablePageListResult<Data>
  | Data[]

// /**
//  * 获取数据函数参数
//  */
// export type FetchTableListQuery<T, P extends object> = {
//   page: { pageNumber: number; pageSize: number }
//   filters: Record<string, FilterValue | null>
//   sorter: SorterResult<T> | SorterResult<T>[]
//   params?: P
// }

/**
 * 分页获取数据函数返回值
 */
export type FetchProTablePageListResult<Data = any> = {
  data: Data[]
  total: number
}

// /**
//  * headerCell 插槽参数
//  */
// export type HeaderCellSlotParams<T> = { column: ColumnType<T>; title: string }

// /**
//  * bodyCell 插槽参数
//  */
// export type BodyCellSlotParams<T> = {
//   text: any
//   index: number
//   column: ColumnType<T>
//   record: T
//   editable: boolean
// }

// /**
//  * ProTable 组件实例方法
//  */
// export type ProTableInstance<T> = ProTableScope<T>

/**
 * Pro Table 列配置
 */
export interface ProTableColumnProps<
  Data = any,
  Dictionary = any,
  Collection = any
> extends DictionaryColumn<Dictionary, Collection> {
  // /**
  //  * 分组列配置
  //  */
  // children?: ProTableColumnProps<T> | ProTableColumnProps<T>[]

  // /**
  //  * 列插槽
  //  */
  // columnSlots?: ProTableColumnSlots<T>

  /**
   * 是否显示列
   */
  show?: MaybeRef<boolean>

  /**
   * 标题
   */
  label?: MaybeRef<string>

  /**
   * 字段名
   */
  name?: MaybeRef<NamePath>

  /**
   * 类型
   *
   * @default 'text'
   */
  type?: MaybeRef<ValueType>

  /**
   * 列配置
   */
  columnProps?: MaybeRef<
    ExtractMaybeRef<Omit<ColumnType<Data>, 'title' | 'dataIndex' | 'key'>>
  >

  /**
   * 自定义渲染表头
   */
  renderHeader?(): VNodeChild

  /**
   * 自定义渲染单元格
   */
  renderCell?(): VNodeChild

  /**
   * 自定义渲染筛选菜单
   */
  renderFilterDropdown?(): VNodeChild

  /**
   * 自定义渲染筛选图标
   */
  renderFilterIcon?(): VNodeChild

  // /**
  //  * 编辑配置
  //  */
  // editable?: ProTableColumnEditable<T>
}

/**
 * Pro Table 列按钮组
 */
export type ProTableActionGroup = ActionGroupOption<ProTableActions>

/**
 * Pro Table 列按钮
 */
export type ProTableActions = {} & CustomActions

/**
 * Pro Table Toolbar 按钮组
 */
export type ProTableToolbarActionGroup =
  ActionGroupOption<ProTableToolbarActions>

/**
 * Pro Table Toolbar 按钮
 */
export type ProTableToolbarActions = {} & CustomActions

// /**
//  * 操作列配置
//  */
// export type ProTableActionColumnProps<T> = Omit<
//   ProTableColumnProps<T>,
//   'type' | 'dict' | 'editable'
// > & {
//   /**
//    * 操作按钮组
//    */
//   actions?: ActionsList<ProTableActions<T>>
// }

// export type ProTableActions<T> = Record<string, ProTableActionProps<T>>

// /**
//  * 操作列按钮配置
//  */
// export interface ProTableActionProps<T>
//   extends Omit<ActionOption, 'props' | 'confirmProps'> {
//   /**
//    * 按钮 props
//    */
//   props?: Omit<ButtonProps, 'onClick'> & {
//     onClick?: (e: MouseEvent, ctx: BodyCellSlotParams<T>) => void
//   }

//   /**
//    * 确认弹窗 props
//    */
//   confirmProps?: ProTableActionConfirmProps<T> | ProTableActionModalProps<T>
// }

// /**
//  * Popconfirm props，onConfirm 事件多了一个参数：行数据
//  */
// export type ProTableActionConfirmProps<T> = Omit<
//   PopconfirmProps,
//   'onConfirm'
// > & {
//   onConfirm?(e: MouseEvent, ctx: BodyCellSlotParams<T>): void
// }

// /**
//  * MessageBox props，callback 多了一个参数：行数据
//  */
// export type ProTableActionModalProps<T> = Omit<ModalProps, 'onOk'> & {
//   onOk?(ctx: BodyCellSlotParams<T>): void
// }

// export type ProTableColumnEditable<T> =
//   | false
//   | ((ctx: BodyCellSlotParams<T>) => boolean)

// /**
//  * 列插槽
//  */
// export type ProTableColumnSlots<T> = {
//   headerCell?(ctx: HeaderCellSlotParams<T>): JSXElement
//   bodyCell?(ctx: BodyCellSlotParams<T>): JSXElement
// }

// /**
//  * @internal
//  */
// export interface InternalProTableColumnProps<T> {
//   show: boolean
//   name: DataIndex | undefined
//   type: ValueType | any
//   dict?: ReturnType<typeof useDictionary>
//   renderCell?: boolean
//   editable?: ProTableColumnEditable<T>
//   columnProps: ColumnType<T>
//   columnSlots?: ProTableColumnSlots<T> | undefined
// }

// /**
//  * buildTable 返回值
//  */
// export type BuildProTableResult<T extends object> = {
//   proTableRef: Ref<ProTableInstance<T> | null>
//   proTableBinding: BuildProTableBinding<T>
// }

/**
 * buildTable option 返回值
 */
export type BuildProTableOptionResult<
  Data = any,
  Params = any,
  Collection = any,
  SearchForm = any,
  SearchFormSubmit = SearchForm
> = DictionaryCollection<Collection> & {
  /**
   * 数据源(不推荐)
   */
  data?: MaybeRef<Data[]>

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<Data>

  /**
   * 默认数据源
   */
  defaultData?: Data[]

  /**
   * Table props
   */
  tableProps?: MaybeRef<ExtractMaybeRef<TableProps>>

  // /**
  //  * 初始页数
  //  *
  //  * @default 1
  //  */
  // initialPageNumber?: number

  /**
   * Table 插槽
   */
  tableSlots?: TableSlots<Data>

  /**
   * 列配置
   */
  // columns?: ProTableColumnProps<T>[]

  /**
   * 操作列配置
   */
  action?: MaybeRef<ProTableActionGroup>

  /**
   * toolbar 配置
   */
  toolbar?: MaybeRef<ProTableToolbarActionGroup>

  /**
   * 请求携带的额外参数，当发生变化时会自动查询
   */
  params?: MaybeRef<Params>

  /**
   * 是否需要首次触发请求
   *
   * @default true
   */
  immediate?: boolean

  /**
   * 编辑配置
   */
  // editable?: ProTableEditable<T>

  /**
   * 是否自动填充父元素
   */
  // autoFill?: boolean

  // /**
  //  * 提交编辑行内容
  //  */
  // submitEditable?: (
  //   values: T,
  //   ctx: BodyCellSlotParams<T>
  // ) => Promise<boolean> | boolean

  // /**
  //  * table 尺寸发生改变
  //  */
  // onSizeChange?: (size: SizeType) => void

  /**
   * 对获取的数据进行处理
   */
  postData?: (data: Data[]) => Data[]

  /**
   * loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean) => void

  /**
   * 数据加载完成后触发,会多次触发
   */
  onLoad?: (dataSource: Data[]) => void

  /**
   * Table 的数据发生改变时触发
   */
  onDataSourceChange?: (dataSource: Data[]) => void

  /**
   * 数据加载失败时触发
   */
  onRequestError?: (error: any) => void

  /**
   * 搜索栏配置
   */
  search?:
    | MaybeRef<false>
    | ((
        scope: ProFormScope<SearchForm>
      ) => BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>)
    | BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>
}

// export type ProTableEditable<T> = false | ProTableEditableOptions<T>

// /**
//  * ProTable 编辑配置
//  */
// export interface ProTableEditableOptions<T> {
//   type?: 'cell' | 'single' | 'multiple'

//   /**
//    * 编辑模式下的操作
//    */
//   actions?: ActionsList<ProTableEditableActions<T>>

//   /**
//    * 编辑成功提示
//    *
//    * @default '编辑成功'
//    */
//   toast?: SuccessToastOptions
// }

// /**
//  * 编辑模式下操作
//  */
// export interface ProTableEditableActions<T> {
//   /**
//    * 确认按钮配置
//    */
//   ok?: ProTableActionProps<T>

//   /**
//    * 取消按钮配置
//    */
//   cancel?: ProTableActionProps<T>
// }

// export interface ProvideEditTableOptions<T> extends ProTableEditableOptions<T> {
//   editRowKeys: Ref<Key[]>
//   values: Record<string, any>

//   getRowKey(record: T): Key
// }

// /**
//  * buildTable 返回需要绑定的 props
//  */
// export interface BuildProTableBinding<T extends object> {
//   tableProps: ComputedRef<TableProps<T>>
//   tableSlots: InternalTableSlots<T>
//   loading: ComputedRef<SpinProps>
//   columns: ComputedRef<ColumnType<T>>[]
//   scope: ProTableScope<T>
//   toolbar: ComputedRef<InternalProTableToolbarOption>
//   editableTableData: ProvideEditTableOptions<T> | undefined
//   autoFill: boolean
// }

// /**
//  * ProTable 作用域
//  */
// export interface ProTableScope<T> {
//   /**
//    * 重新加载指定页数数据，默认加载当前页数
//    */
//   reload(data?: Partial<FetchTableListQuery<T, any>>): Promise<void>

//   /**
//    * 恢复默认页重新加载
//    */
//   reset(): Promise<void>

//   /**
//    * 跳转上一页
//    */
//   previous(): Promise<void>

//   /**
//    * 加载下一页
//    */
//   next(): Promise<void>

//   /**
//    * 获取 ATable ref
//    */
//   getTableRef(): Ref<any>

//   /**
//    * 开始编辑
//    *
//    * @param rowKey 需要编辑的行 id，使用 rowKey
//    */
//   startEditable(rowKey: Key): void

//   /**
//    * 取消编辑
//    *
//    * @param rowKey 需要编辑的行 id，使用 rowKey
//    */
//   cancelEditable(rowKey: Key): void

//   /**
//    * 检测是否处于编辑状态
//    * @param rowKey
//    * @param columnName
//    */
//   validateEditable(rowKey: Key): boolean

//   /**
//    * 获取行数据
//    * @param rowKey
//    */
//   getRowData(rowKey: Key): T | undefined

//   /**
//    * 设置行数据
//    * @param rowKey
//    * @param data
//    */
//   setRowData(rowKey: Key, data: Partial<T>): void
// }

// /**
//  * Table 插槽
//  */
export interface TableSlots<Data> {
  emptyText?(): VNodeChild
  summary?(): VNodeChild
  title?(data: Data[]): VNodeChild
  footer?(data: Data[]): VNodeChild
  expandIcon?(): VNodeChild
  expandColumnTitle?(): VNodeChild
  expandedRowRender?(ctx: Parameters<ExpandedRowRender<Data>>[0]): VNodeChild
  // customFilterDropdown?(ctx: FilterDropdownProps<T>): VNodeChild
  // customFilterIcon?(ctx: {
  //   filtered: boolean
  //   column: ColumnType<T>
  // }): VNodeChild
}

// /**
//  * @internal
//  */
// export interface InternalTableSlots<T> extends TableSlots<T> {
//   headerCell?(ctx: HeaderCellSlotParams<T>): JSXElement
//   bodyCell?(ctx: BodyCellSlotParams<T>): JSXElement
// }

/**
 * toolbar 配置
 */
export interface ProTableToolbarOption<Toolbar = any> {
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
  actions?: ProTableToolbarActions<Toolbar>
}

// /**
//  * Pro Table 操作按钮组
//  */
// export type ProTableToolbarActions<Toolbar = any> = {
//   /**
//    * 刷新按钮
//    */
//   reload?: ToolbarOption

//   /**
//    * 导出按钮
//    */
//   export?: ToolbarOption

//   /**
//    * 密度按钮
//    */
//   density?: ToolbarOption

//   /**
//    * 设置按钮
//    */
//   settings?: ToolbarOption

//   /**
//    * 其他
//    */
//   [type: string]: ToolbarOption | undefined
// } & Toolbar

// /**
//  * toolbar 按钮配置
//  */
// export interface ToolbarOption {
//   /**
//    * 是否显示操作
//    */
//   show?: MaybeRef<boolean>

//   /**
//    * 优先级，越高越靠前
//    */
//   order?: MaybeRef<number>

//   /**
//    * button 配置
//    */
//   props?: ButtonProps & { buttonText?: VNodeChild }

//   /**
//    * 提示 配置
//    */
//   tooltip?: ToolbarOptionTooltip

//   /**
//    * 自定义渲染操作
//    */
//   render?: () => VNodeChild
// }

// /**
//  * toolbar 按钮 tooltip 配置
//  */
// export interface ToolbarOptionTooltip extends TooltipProps {
//   show?: MaybeRef<boolean>
// }

// export interface InternalProTableToolbarOption {
//   show: boolean
//   actions: ToolbarOption[]
//   style?: string | CSSProperties
//   class?: string | string[] | Record<string, boolean>
//   tooltip?: TooltipProps
//   space: SpaceProps
// }
