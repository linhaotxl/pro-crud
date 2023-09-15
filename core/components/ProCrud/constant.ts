import type { ProSearchInstance } from './../ProSearch/interface'
import type { ProTableInstance } from './../ProTable/interface'
import type { CrudDialogOption } from './interface'
import type { ProFormInstance } from '../ProForm'
import type { InjectionKey, Ref } from 'vue'

export const ProSearchRef = Symbol() as InjectionKey<
  Ref<ProSearchInstance<any> | null>
>

export const ProTableRef = Symbol() as InjectionKey<
  Ref<ProTableInstance<any> | null>
>

export const AddFormRef = Symbol() as InjectionKey<
  Ref<ProFormInstance<any> | null>
>

export const EditFormRef = Symbol() as InjectionKey<
  Ref<ProFormInstance<any> | null>
>

export const ViewFormRef = Symbol() as InjectionKey<
  Ref<ProFormInstance<any> | null>
>

// 默认显示搜索栏，添加表单，编辑表单，查看表单，table
export const DefaultShow = {
  show: true,
}

export const DefaultDialogOption: CrudDialogOption = {
  is: 'a-modal',
  props: { width: '40%' },
}

export const DefaultCrudForm = {
  col: { span: 12 },
  row: { gutter: 16 },
}

export const DefaultEditFormToast = '编辑成功'

export const DefaultAddFormToast = '新增成功'

export const DeleteRecordToast = '删除成功'

export const ConfirmDeleteContent = '确认删除这一项？'
