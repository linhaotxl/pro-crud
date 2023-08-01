import type { ProFormInstance, ProFormScope } from './interface'

export function useScope<T extends object>(getCtx: () => ProFormInstance<T>) {
  const scope: ProFormScope<T> = {
    getFormValues() {
      console.log(111, getCtx())
      return getCtx()?.getFormValues()
    },

    submit() {
      return getCtx().submit()
    },

    reset(prop) {
      return getCtx().reset(prop)
    },

    resetFields(prop) {
      return scope.reset(prop)
    },

    setFieldValue(prop, value) {
      return getCtx().setFieldValue(prop, value)
    },

    setFieldValues(values) {
      return getCtx().setFieldValues(values)
    },

    setFieldValuesTransform(values) {
      return getCtx().setFieldValuesTransform(values)
    },

    getFieldValue(prop) {
      return getCtx().getFieldValue(prop)
    },

    removeFields(prop) {
      return getCtx().removeFields(prop)
    },

    validate(callback) {
      return getCtx().validate(callback)
    },

    validateField(props, callback) {
      return getCtx().validateField(props, callback)
    },

    scrollToField(prop) {
      return getCtx().scrollToField(prop)
    },

    clearValidate(props) {
      return getCtx().clearValidate(props)
    },

    getFieldInstance(prop) {
      return getCtx().getFieldInstance(prop)
    },
  }

  return scope
}
