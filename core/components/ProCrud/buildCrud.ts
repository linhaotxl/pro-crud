import { ref } from 'vue'

import { useScope as useFormScope } from '../ProForm'
import { useScope as useTableScope } from '../ProTable'

import type {
  BuildCrudReturn,
  ProCrudInstance,
  ProCrudProps,
  ProCrudScope,
} from './interface'
import type { ProTableInstance } from '../ProTable'

export function buildCrud<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx?: undefined) => ProCrudProps<T, S, F, R>
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx: C) => ProCrudProps<T, S, F, R>,
  context: C
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx?: C) => ProCrudProps<T, S, F, R>,
  ctx?: C
): BuildCrudReturn<T, S, F, R> {
  const proCrudRef = ref<ProCrudInstance | null>(null)

  const scope: ProCrudScope = {
    search: useFormScope(() => proCrudRef.value!.proSearchRef!),
    table: useTableScope(() => ref(proCrudRef.value!.proTableRef!)),
  }

  console.log('scope: ', scope)

  const { columns, table, search, addForm, editForm, viewForm, request } =
    options(scope, ctx)

  const crudBinding = {
    columns,
    table,
    search,
    addForm,
    editForm,
    viewForm,
    request,
  }

  return { proCrudRef, crudBinding }
}
