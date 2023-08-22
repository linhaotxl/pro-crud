import { PlusOutlined } from '@ant-design/icons-vue'
import { merge } from 'lodash-es'
import { computed, h, inject, provide, ref } from 'vue'

import { compose } from './compose'
import {
  AddFormRef,
  DefaultDialogOption,
  DefaultShow,
  EditFormRef,
  ProSearchRef,
  ProTableRef,
  ViewFormRef,
} from './constant'
import {
  type BuildCrudBinding,
  type BuildCrudContext,
  type BuildCrudOptionReturn,
  type BuildCrudReturn,
  type CrudFormOptionResult,
  type ProCrudColumnOption,
  type ProCrudInstance,
  type ProCrudScope,
} from './interface'
import { useDialog } from './useDialog'
import { useOperate } from './useOperate'

import { unRef, useDict } from '../common'
import {
  buildForm,
  type ButtonsOption,
  type ProFormColumnOptions,
} from '../ProForm'
import { buildSearch } from '../ProSearch'
import { buildTable } from '../ProTable'

import { GlobalOption } from '~/constant'

import type { Middleware } from './compose'
import type { CrudDialogOption, CrudFormOption } from './interface'
import type { BuildFormOptionResult } from '../ProForm'
import type {
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableColumnProps,
  ProTableToolbarOption,
} from '../ProTable'
import type { ProComponentsOptions } from '~/constant'

export function buildCrud<
  T extends object = any,
  R extends object = any,
  S extends object = any,
  S1 extends object = any,
  A extends object = any,
  E extends object = any
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx?: undefined
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>
): BuildCrudReturn<T, S, A, E>

export function buildCrud<
  C extends object,
  R extends object,
  T extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx: C
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>,
  context: C
): BuildCrudReturn<T, S, A, E>

export function buildCrud<
  C extends object,
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx?: C
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>,
  ctx?: C
): BuildCrudReturn<T, S, A, E> {
  const proCrudRef = ref<ProCrudInstance | null>(null)

  const context = {
    scope: {},
    binding: {},
    dialog: {},
    originCtx: ctx,
    options,
  } as BuildCrudContext<T, R, S, S1, A, E>

  compose<BuildCrudContext<T, R, S, S1, A, E>>([
    buildSearchMiddlewre,
    buildTableMiddleware,
    buildAddFormMiddleware,
    buildEditFormMiddleware,
    buildViewFormMiddleware,
    buildBasicMiddleware,
  ])(context)

  const {
    show: {
      search: searchShow,
      table: tableShow,
      addForm: addFormShow,
      editForm: editFormShow,
      viewForm: viewFormShow,
    },
    binding: {
      search: searchBinding,
      table: tableBinding,
      addForm: addFormBinding,
      editForm: editFormBinding,
      viewForm: viewFormBinding,
    },
    dialog: {
      addForm: addFormDialog,
      editForm: editFormDialog,
      viewForm: viewFormDialog,
    },
  } = context

  const proCrudBinding: BuildCrudBinding<T, S, A, E> = {
    searchShow,
    searchBinding,
    tableShow,
    tableBinding,
    addFormShow,
    addFormBinding,
    addFormDialog,
    editFormShow,
    editFormBinding,
    editFormDialog,
    viewFormShow,
    viewFormBinding,
    viewFormDialog,
  }

  // @ts-ignore
  return { proCrudRef, proCrudBinding }
}

const buildSearchMiddlewre: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proSearchBinding, proSearchRef } = buildSearch(scope => {
    ctx.scope.search = scope

    next()

    const {
      show: _,
      buttons: customButtons,
      ...rest
    } = ctx.optionResult.search || {}

    const buttons = merge<ButtonsOption, ButtonsOption | undefined>(
      {
        list: {
          confirm: {
            props: {
              onClick() {
                ctx.scope.table.reload()
              },
            },
          },

          reset: {
            props: {
              onClick() {
                ctx.scope.search.reset()
                if (ctx.optionResult.autoReload) {
                  ctx.scope.table.reload()
                }
              },
            },
          },
        },
      },
      customButtons
    )

    return {
      columns: ctx.columns.search.map<ProFormColumnOptions<any>>(column => ({
        label: column.label,
        name: column.name,
        type: column.type,
        dict: column.dict,
        ...column.search,
      })),
      buttons,
      ...rest,
    }
  })

  ctx.binding.search = proSearchBinding
  provide(ProSearchRef, proSearchRef)
}

const buildTableMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proTableBinding, proTableRef } = buildTable(scope => {
    ctx.scope.table = scope

    next()

    const operateColumn = useOperate(ctx)

    const { show: _, toolbar, ...rest } = ctx.optionResult.table || {}

    return {
      toolbar: merge<ProTableToolbarOption, ProTableToolbarOption | undefined>(
        {
          list: {
            add: {
              show: true,
              tooltip: { title: '添加' },
              props: {
                icon: h(PlusOutlined),
                onClick: ctx.scope.addForm.showDialog,
              },
            },
          },
        },
        toolbar
      ),
      ...rest,
      columns: ctx.columns.table
        .map<ProTableColumnProps<any>>(column => ({
          label: column.label,
          name: column.name,
          dict: column.dict,
          type: column.type,
          ...column.table,
        }))
        .concat(operateColumn),

      fetchTableData,
    }
  })

  let globalOption: ProComponentsOptions | undefined
  const transformQuery =
    ctx.optionResult.request?.transformQuery ??
    ensureGlobalOption()?.transformQuery
  const transformResponse =
    ctx.optionResult.request?.transformResponse ??
    ensureGlobalOption()?.transformResponse

  function ensureGlobalOption() {
    return globalOption ? globalOption : (globalOption = inject(GlobalOption))
  }

  /**
   * 获取数据
   */
  async function fetchTableData(
    query: FetchTableListQuery<any, any>
  ): Promise<FetchTableDataResult<any>> {
    const {
      scope: { search },
      optionResult: { request },
    } = ctx
    const form = search.getFormValues()
    const params = { query, form }

    const transformInput = transformQuery?.(params) ?? params

    const response = (await request?.fetchPaginationData?.(
      transformInput
    )) as any

    const transformOutput = (transformResponse?.({
      query: transformInput,
      response,
    }) ?? response) as FetchTableDataResult<any>

    return {
      data: transformOutput.data,
      total: transformOutput.total,
    }
  }

  ctx.binding.table = proTableBinding
  provide(ProTableRef, proTableRef)
}

const buildAddFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.addForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.addForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '新增' } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.addFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.addForm.map<ProFormColumnOptions<any>>(
      column => ({
        label: column.label,
        name: column.name,
        dict: column.dict,
        type: column.type,
        ...column.addForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        col: { span: 12 },
        buttons: {
          show: false,
          list: {
            cancel: {
              text: '取消',
              show: true,
              props: { onClick: hideDialog },
            },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.addForm,
      {
        columns,
        submitRequest: ctx.optionResult.request?.addRequest,
        successRequest() {
          hideDialog()
          ctx.scope.table.reload()
        },
      }
    )
  })

  ctx.binding.addForm = proFormBinding

  provide(AddFormRef, proFormRef)
}

const buildEditFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.editForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.editForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '编辑' } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.editFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.editForm.map<ProFormColumnOptions<any>>(
      column => ({
        label: column.label,
        name: column.name,
        dict: column.dict,
        type: column.type,
        ...column.editForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        col: { span: 12 },
        buttons: {
          show: false,
          list: {
            cancel: {
              text: '取消',
              show: true,
              props: { onClick: hideDialog },
            },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.editForm,
      {
        columns,
        submitRequest: ctx.optionResult.request?.editRequest,
        successRequest() {
          hideDialog()
          ctx.scope.table.reload()
        },
      }
    )
  })

  ctx.binding.editForm = proFormBinding
  provide(EditFormRef, proFormRef)
}

const buildViewFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.viewForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.viewForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '查看' } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.viewFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.viewForm.map<ProFormColumnOptions<any>>(
      column => ({
        label: column.label,
        name: column.name,
        dict: column.dict,
        type: column.type,
        ...column.viewForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        col: { span: 12 },
        buttons: {
          show: false,
          list: {
            cancel: {
              text: '取消',
              show: true,
              props: { onClick: hideDialog },
            },
            confirm: { show: false },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.viewForm,
      {
        columns,
        formProps: { disabled: true },
      }
    )
  })

  ctx.binding.viewForm = proFormBinding
  provide(ViewFormRef, proFormRef)
}

const buildBasicMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const {
    scope: { search, table, addForm, editForm, viewForm },
  } = ctx

  const optionResult = (ctx.optionResult = ctx.options(
    {
      search,
      addForm,
      editForm,
      viewForm,
      table,
    },
    ctx.originCtx
  ))

  ctx.optionResult.autoReload ??= true

  ctx.columns = normalizeColumns(optionResult.columns)

  ctx.show = normalizeShow(optionResult)

  next()
}

function normalizeColumns(
  columns: ProCrudColumnOption<any, any, any, any>[] | undefined
) {
  const initialColumns: BuildCrudContext<
    any,
    any,
    any,
    any,
    any,
    any
  >['columns'] = {
    table: [],
    search: [],
    addForm: [],
    editForm: [],
    viewForm: [],
  }

  const result =
    columns?.reduce((prev, curr) => {
      curr.dict = useDict(curr.dict) as any

      if (!(curr.search?.show === false)) {
        prev.search.push(curr)
      }
      if (!(curr.table?.show === false)) {
        prev.table.push(curr)
      }
      if (!(curr.addForm?.show === false)) {
        prev.addForm.push(curr)
      }
      if (!(curr.editForm?.show === false)) {
        prev.editForm.push(curr)
      }
      if (!(curr.viewForm?.show === false)) {
        prev.viewForm.push(curr)
      }

      return prev
    }, initialColumns) ?? initialColumns

  return result
}

function normalizeShow(
  optionResult: BuildCrudOptionReturn<any, any, any, any, any, any>
) {
  return (
    ['search', 'table', 'addForm', 'editForm', 'viewForm'] as const
  ).reduce<BuildCrudContext<any, any, any, any, any, any>['show']>(
    (prev, type) => {
      prev[type] = computed(() =>
        unRef(optionResult[type]?.show ?? DefaultShow.show)
      )
      return prev
    },
    {} as any
  )
}
