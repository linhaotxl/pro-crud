import { merge } from 'lodash-es'
import { ref } from 'vue'

import { unRef } from '../common'

import type { ProFormInstance } from '../ProForm'
import type { ModalProps } from 'ant-design-vue'

export function useDialog<T extends object = any>(form: ProFormInstance<T>) {
  const open = ref(false)

  function showDialog(values?: T) {
    open.value = true
    form.reset()
    if (values) {
      form.setFieldValues(values)
    }
  }

  function hideDialog() {
    open.value = false
  }

  function merged(props?: ModalProps) {
    const mergedProps = merge({}, props, { open, onClose: hideDialog })
    return Object.entries(mergedProps).reduce((prev, [key, prop]) => {
      // @ts-ignore
      prev[key] = unRef(prop)
      return prev
    }, {})
  }

  return {
    showDialog,
    hideDialog,
    merged,
  }
}
