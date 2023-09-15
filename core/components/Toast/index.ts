import {
  message as _message,
  notification as _notification,
  type MessageArgsProps,
  App,
} from 'ant-design-vue'
import { merge } from 'lodash-es'

import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

export type SuccessToastOptions = false | string | NormalizeToastOptions

export type NormalizeToastOptions =
  | {
      type: 'message'
      props?: MessageArgsProps
    }
  | {
      type: 'notification'
      props?: NotificationArgsProps
    }

const DefaultSuccessToastOptions = { type: 'message' } as const

const { message, notification } = App.useApp() ?? {
  message: _message,
  notification: _notification,
}

const DefaultSuccessMessage = '操作成功'

export function showToast(toast: SuccessToastOptions | undefined) {
  if (toast === false) {
    return
  }

  const content =
    (toast
      ? typeof toast === 'string'
        ? toast
        : toast.type === 'message'
        ? toast.props?.content
        : toast.type === 'notification'
        ? toast.props?.message
        : DefaultSuccessMessage
      : DefaultSuccessMessage) ?? DefaultSuccessMessage

  const merged: NormalizeToastOptions = merge(
    {},
    DefaultSuccessToastOptions,
    typeof toast === 'string' ? undefined : toast
  )

  if (merged.type === 'message') {
    // @ts-ignore
    message.success({ ...merged.props, content })
  } else if (merged.type === 'notification') {
    notification.success({ ...merged.props, message: content })
  }
}
