import { merge } from 'lodash-es'
import {
  computed,
  inject,
  isRef,
  nextTick,
  provide,
  reactive,
  ref,
  watch,
} from 'vue'

import {
  DefaultPageNumber,
  DefaultPageSize,
  EditableTableData,
  ProTableRefKey,
} from './constant'
import { useAction } from './useAction'
import { useColumns } from './useColumns'
import { useToolbar } from './useToolbar'

import { resolveRef, unRef } from '../common'

import { GlobalOption } from '~/constant'

import type {
  BuildProTableOptionResult,
  BuildProTableResult,
  FetchTableListQuery,
  ProTableInstance,
  ProTableScope,
  ProvideEditTableOptions,
} from './interface'
import type { SpinProps, TableProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { Ref } from 'vue'

export function buildTable<
  T extends object,
  C = undefined,
  P extends object = any
>(
  options: (
    scope: ProTableScope<T>,
    ctx?: C | undefined
  ) => BuildProTableOptionResult<T, P>
): BuildProTableResult<T>
export function buildTable<T extends object, C, P extends object = any>(
  options: (scope: ProTableScope<T>, ctx: C) => BuildProTableOptionResult<T, P>,
  ctx: C
): BuildProTableResult<T>

export function buildTable<T extends object, C, P extends object = any>(
  options: (
    scope: ProTableScope<T>,
    ctx?: C
  ) => BuildProTableOptionResult<T, P>,
  ctx?: C | undefined
): BuildProTableResult<T> {
  const tableRef = ref<any>(null)

  provide(ProTableRefKey, tableRef)

  // 作用域对象
  const scope: ProTableScope<T> = {
    next,
    previous,
    reset,
    reload,
    startEditable,
    cancelEditable,
    getTableRef() {
      return tableRef
    },
    validateEditable(rowKey) {
      if (!editableTableData) {
        return false
      }

      return editableTableData.editRowKeys.value.includes(rowKey)
    },
    getRowData(rowKey) {
      if (editableTableData) {
        return editableTableData.values[rowKey]
      }
      return undefined
    },
    setRowData(rowKey, data) {
      if (editableTableData) {
        editableTableData.values[rowKey] = data
      }
    },
  }

  const {
    autoFill = true,
    immediate = true,
    columns: originColumns = [],
    data: originData,
    defaultData = [],
    tableProps = {},
    editable = false,
    tableSlots: originTableSlots,
    initialPageNumber = DefaultPageNumber,
    loading: originLoading,
    toolbar: originToolbar,
    params,
    action,
    fetchDictCollection,
    postData,
    onLoad,
    fetchTableData,
    submitEditable,
    onSizeChange,
    onLoadingChange,
    onDataSourceChange,
    onRequestError,
  } = options(scope, ctx)

  const editableTableData: ProvideEditTableOptions<T> | undefined =
    editable !== false
      ? {
          ...editable,
          editRowKeys: ref([]),
          values: reactive({}),
          getRowKey,
        }
      : undefined

  provide(EditableTableData, editableTableData)

  // 真实数据
  const data = ref(defaultData) as Ref<T[]>

  // 监听数据变化
  if (onDataSourceChange) {
    watch(data, _data => {
      onDataSourceChange(_data)
    })
  }

  // 加载状态
  const loading = ref(false)

  // 监听 loading 变化
  if (onLoadingChange) {
    watch(loading, _loading => {
      onLoadingChange(_loading)
    })
  }

  /**
   * 开始编辑行
   * @param rowKey
   */
  function startEditable(rowKey: Key) {
    if (editableTableData) {
      editableTableData.editRowKeys.value.push(rowKey)

      const record = data.value.find(record => getRowKey(record) === rowKey)

      if (record) {
        scope.setRowData(rowKey, { ...record })
      }
    }
  }

  /**
   * 取消编辑行
   */
  function cancelEditable(rowKey: Key) {
    let index = -1
    if (
      editableTableData &&
      (index = editableTableData.editRowKeys.value.indexOf(rowKey)) !== -1
    ) {
      editableTableData.editRowKeys.value.splice(index, 1)

      // TODO:
      delete editableTableData.values[rowKey]
    }
  }

  /**
   * 获取 rowKey
   * @param record
   * @returns
   */
  function getRowKey(record: T) {
    const rowKey = resolvedTableProps.value.rowKey
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    if (typeof rowKey === 'string') {
      return (record as any)[rowKey]
    }
  }

  const { toolbar, tableSize } = useToolbar(tableProps, originToolbar, scope)

  // 监听 table 尺寸变化
  if (onSizeChange) {
    watch(tableSize, size => {
      onSizeChange(size)
    })
  }

  // 上一次查询的条件，主要用来 reload 保持数据不变
  let previousQuery: FetchTableListQuery<T, P>

  // 分页
  const p = unRef(unRef(tableProps).pagination)
  const pageNumber = ref(initialPageNumber)
  const pageSize = ref(
    p !== false ? p?.defaultPageSize ?? DefaultPageSize : DefaultPageSize
  )
  const initialPageSize = pageSize.value
  const total = ref(1)

  // 解析 table props
  const resolvedTableProps = computed(() => {
    const result: TableProps<T> = {
      dataSource: data.value,
      size: unRef(tableSize),
      onChange(page, filters, sorter) {
        _fetchTableData({
          page: { pageNumber: page.current!, pageSize: page.pageSize! },
          filters,
          sorter,
        })
      },
      onResizeColumn: onResizeColumn.value,
    }

    const props = unRef(tableProps)

    ;(Object.keys(props) as (keyof TableProps<T>)[]).forEach(key => {
      // @ts-ignore
      result[key] = unRef(props[key])
    })

    const pagination = unRef(props.pagination)

    if (pagination === false) {
      result.pagination = pagination
    } else {
      result.pagination = merge(
        {},
        inject(GlobalOption)?.pagination,
        pagination,
        {
          pageSize: pageSize.value,
          current: pageNumber.value,
          total: total.value,
        }
      )
    }

    if (autoFill && !result.scroll) {
      result.scroll = {
        scrollToFirstRowOnChange: true,
        y: 'auto',
        x: 'max-content',
      }
    }

    return result
  })

  const { columns, tableSlots, onResizeColumn } = useColumns(
    scope,
    originColumns.concat(
      useAction(scope, action, editable, getRowKey, submitEditable)
    ),
    originTableSlots,
    getRowKey,
    fetchDictCollection
  )

  let resolvedParams = unRef(params)

  // 监听 params 变化，自动发起请求
  if (params) {
    watch(resolveRef(params), p => {
      resolvedParams = p
      reset()
    })
  }

  /**
   * 加载指定页数内容
   */
  async function _fetchTableData(query: Partial<FetchTableListQuery<T, P>>) {
    if (originData) {
      return
    }

    const resolvedQuery: FetchTableListQuery<T, P> = merge<
      FetchTableListQuery<T, P>,
      Partial<FetchTableListQuery<T, P>>
    >(
      {
        page: { pageNumber: pageNumber.value, pageSize: pageSize.value },
        filters: {},
        sorter: [],
        params: resolvedParams,
      },
      query
    )

    previousQuery = resolvedQuery

    loading.value = true
    pageNumber.value = resolvedQuery.page.pageNumber
    pageSize.value = resolvedQuery.page.pageSize

    try {
      const tableResult = await fetchTableData?.(resolvedQuery)
      const { data: d = [], total: t = 1 } = tableResult ?? {}

      data.value = postData?.(d) ?? d

      total.value = t

      onLoad?.(d)
    } catch (e) {
      onRequestError?.(e)
    } finally {
      loading.value = false
    }
  }

  // 解析 loading 配置
  const resolvedLoadingConfig = computed(() => {
    const loadingProps = unRef(originLoading)
    const result: SpinProps = { spinning: loading.value }

    if (loadingProps) {
      ;(Object.keys(loadingProps) as (keyof SpinProps)[]).forEach(key => {
        // @ts-ignore
        result[key] = unRef(loadingProps[key])
      })
    }

    return result
  })

  /**
   * 加载下一页数据
   */
  function next() {
    return _fetchTableData({
      page: { pageNumber: pageNumber.value + 1, pageSize: pageSize.value },
    })
  }

  /**
   * 加载上一页数据
   */
  function previous() {
    return _fetchTableData({
      page: { pageNumber: pageNumber.value - 1, pageSize: pageSize.value },
    })
  }

  /**
   * 重新加载当前页数据
   */
  function reload() {
    return _fetchTableData(previousQuery)
  }

  /**
   * 恢复默认页重新加载
   */
  function reset() {
    return _fetchTableData({
      page: { pageNumber: initialPageNumber, pageSize: initialPageSize },
    })
  }

  /**
   * 获取所有列配置
   */
  // function _fetProTableColumn() {
  //   return columns
  // }

  /**
   * 修改列显示状态
   */
  // function changeColumnVisible(name: DataIndex, visible: boolean) {
  //   // columnsShow.set(name, visible)
  // }

  /**
   * 修改列顺序
   */
  // function changeColumnSort(fromIndex: number, toIndex: number) {
  //   // sort(fromIndex, toIndex)
  // }

  /**
   *
   */
  // function _setPropFixed(prop: string, fixed?: boolean | string) {
  //   setFixed(prop, fixed)
  // }

  nextTick(() => {
    if (originData) {
      watch(
        isRef(originData) ? originData : () => originData,
        _d => {
          data.value = _d as T[]
        },
        { immediate }
      )
    } else {
      if (typeof fetchTableData !== 'function') {
        throw new Error('fetchTableData must be function.')
      }
      if (immediate) {
        reload()
      }
    }
  })

  const proTableRef = ref<ProTableInstance<T> | null>(null)
  const buildProTableResult: BuildProTableResult<T> = {
    proTableRef,
    proTableBinding: {
      columns,
      tableProps: resolvedTableProps,
      tableSlots,
      loading: resolvedLoadingConfig,
      toolbar,
      scope,
      editableTableData,
      autoFill,
      // editFormBinding,
    },
  }

  return buildProTableResult
}
