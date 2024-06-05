import { mount } from '@vue/test-utils'
import antdv, { Flex, Pagination, Table } from 'ant-design-vue'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProButtonGroup } from '../../ProButton'
import { ProForm } from '../../ProForm'
import { buildTable } from '../buildTable'
import { ProTable } from '../ProTable'

import type {
  FetchProTablePageListQuery,
  ProTableScope,
  ProTableSearchOptions,
} from '../interface'
import type { FlexProps } from 'ant-design-vue'
import type { Ref } from 'vue'

type Person = {
  name: string
  age: number
}

describe('Build Pro Table', () => {
  test('default contain toolbar, table and search', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {}
        })
        return () => {
          return h(ProTable, proTableBinding)
        }
      },
    })
    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(3)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(2)
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
  })

  test('toggle toolbar visible', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const show = ref(false)
        const { proTableBinding } = buildTable(() => {
          return {
            toolbar: {
              show,
            },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-show-btn',
              onClick() {
                show.value = !show.value
              },
            }),
          ]
        }
      },
    })
    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(1)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
    const toggleButton = wrapper.find('.toggle-show-btn')
    expect(toggleButton.exists()).toBe(true)
    await toggleButton.trigger('click')
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(3)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(2)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
    await toggleButton.trigger('click')
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(1)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
  })

  test('toggle search visible', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const search = ref(false) as Ref<ProTableSearchOptions>
        const { proTableBinding } = buildTable(() => {
          return {
            search,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-show-btn',
              onClick() {
                if (search.value === false) {
                  search.value = {}
                } else {
                  search.value = false
                }
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(2)
    expect(wrapper.findAllComponents(ProForm).length).toBe(0)

    const toggleButton = wrapper.find('.toggle-show-btn')
    expect(toggleButton.exists()).toBe(true)
    await toggleButton.trigger('click')

    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(3)
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)

    await toggleButton.trigger('click')
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(2)
    expect(wrapper.findAllComponents(ProForm).length).toBe(0)
  })

  test('pro table defaultData', async () => {
    type Person = {
      name: string
      age: number
    }

    const defaultPerson: Person = {
      name: 'Edwards',
      age: 26,
    }

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            defaultData: [defaultPerson],
          }
        })
        return () => {
          return [h(ProTable, proTableBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)

    expect(wrapper.findAll('.ant-table-thead').length).toBe(1)
    expect(wrapper.findAll('.ant-table-thead tr').length).toBe(1)
    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(2)
    expect(wrapper.findAll('.ant-table-thead tr th')[0].text()).toBe('姓名')
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')

    expect(wrapper.findAll('.ant-table-tbody').length).toBe(1)
    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(1)
    expect(wrapper.findAll('.ant-table-tbody tr td').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr td')[0].text()).toBe('Edwards')
    expect(wrapper.findAll('.ant-table-tbody tr td')[1].text()).toBe('26')
  })

  test('pro table data', async () => {
    type Person = {
      name: string
      age: number
    }

    const stack: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'add-button',
              onClick() {
                const last = stack.pop()
                if (last) {
                  data.value.push(last)
                }
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-empty').length).toBe(1)

    const addButton = wrapper.find('.add-button')
    expect(addButton.exists()).toBe(true)

    await addButton.trigger('click')

    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(1)
    expect(wrapper.findAll('.ant-table-tbody tr')[0].findAll('td').length).toBe(
      2
    )
    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[0].text()
    ).toBe('Nicholas')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[1].text()
    ).toBe('25')

    await addButton.trigger('click')

    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr')[1].findAll('td').length).toBe(
      2
    )
    expect(
      wrapper.findAll('.ant-table-tbody tr')[1].findAll('td')[0].text()
    ).toBe('IconMan')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[1].findAll('td')[1].text()
    ).toBe('24')
  })

  test('pro table fetch data', async () => {
    type Person = {
      name: string
      age: number
    }

    type SearchParams = { score?: number }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const onLoadingChange = vi.fn(() => {
      //
    })
    const fetchTableData = vi.fn(async () => {
      await sleep(1)
      return {
        total: list.length,
        data: list,
      }
    })

    const sleep = (time: number) => new Promise(r => setTimeout(r, time))

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person, SearchParams>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            fetchTableData,
            onLoadingChange,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'add-button',
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(onLoadingChange).toHaveBeenCalledTimes(1)
    expect(onLoadingChange).toHaveBeenCalledWith(true)
    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-empty').length).toBe(1)
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(true)
    expect(fetchTableData).toHaveBeenCalledTimes(1)

    await sleep(1)

    expect(onLoadingChange).toHaveBeenCalledTimes(2)
    expect(onLoadingChange).toHaveBeenCalledWith(false)
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(false)
    expect(wrapper.findAll('.ant-empty').length).toBe(0)
    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr')[0].findAll('td').length).toBe(
      2
    )
    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[0].text()
    ).toBe('IconMan')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[1].text()
    ).toBe('24')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[1].findAll('td')[0].text()
    ).toBe('Nicholas')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[1].findAll('td')[1].text()
    ).toBe('25')
  })

  test('pro table has params', async () => {
    type Person = {
      name: string
      age: number
    }

    type SearchParams = { score?: number }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const fetchTableData = vi.fn(() => {
      return {
        total: list.length,
        data: list,
      }
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const params: SearchParams = { score: 80 }
        const { proTableBinding } = buildTable<Person, SearchParams>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            params,
            fetchTableData,
          }
        })
        return () => {
          return [h(ProTable, proTableBinding)]
        }
      },
    })

    mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(fetchTableData).toHaveBeenCalledTimes(1)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { score: 80 },
    })
  })

  test('pro table has ref params', async () => {
    type Person = {
      name: string
      age: number
    }

    type SearchParams = { score?: number }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const fetchTableData = vi.fn(() => {
      return {
        total: list.length,
        data: list,
      }
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const params = ref<SearchParams>({ score: 80 })
        const { proTableBinding } = buildTable<Person, SearchParams>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            params,
            fetchTableData,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'add-button',
              onClick() {
                params.value.score!++
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(fetchTableData).toHaveBeenCalledTimes(1)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { score: 80 },
    })

    const addButton = wrapper.find('.add-button')
    expect(addButton.exists()).toBe(true)

    await addButton.trigger('click')

    expect(fetchTableData).toHaveBeenCalledTimes(2)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { score: 81 },
    })

    await addButton.trigger('click')

    expect(fetchTableData).toHaveBeenCalledTimes(3)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { score: 82 },
    })
  })

  test('pro table hook called', async () => {
    type Person = {
      name: string
      age: number
    }

    type PersonIndex = { i: number } & Person

    type SearchParams = { score?: number }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const listWithIndex = list.map<PersonIndex>((person, i) => ({
      ...person,
      i,
    }))

    const sleep = (time = 0) => new Promise(r => setTimeout(r, time))

    const fetchTableData = vi.fn(async () => {
      await sleep()
      return {
        total: list.length,
        data: list,
      }
    })
    const postData = vi.fn(() => listWithIndex)
    const onLoadingChange = vi.fn(() => {
      //
    })
    const onLoad = vi.fn(() => {
      //
    })
    const onDataSourceChange = vi.fn(() => {
      //
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const params = ref<SearchParams>({ score: 80 })
        const { proTableBinding } = buildTable<Person, SearchParams>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            params,
            fetchTableData,
            postData,
            onLoadingChange,
            onLoad,
            onDataSourceChange,
          }
        })
        return () => {
          return [h(ProTable, proTableBinding)]
        }
      },
    })

    mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(fetchTableData).toHaveBeenCalledTimes(1)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { score: 80 },
    })
    expect(onLoadingChange).toHaveBeenCalledTimes(1)
    expect(onLoadingChange).toHaveBeenCalledWith(true)
    expect(postData).toHaveReturnedTimes(0)
    expect(onLoad).toHaveBeenCalledTimes(0)
    expect(onDataSourceChange).toHaveBeenCalledTimes(0)

    await sleep()

    expect(onLoadingChange).toHaveBeenCalledTimes(2)
    expect(onLoadingChange).toHaveBeenCalledWith(false)
    expect(postData).toHaveReturnedTimes(1)
    expect(postData).toHaveBeenCalledWith(list)
    expect(postData).toHaveReturnedWith(listWithIndex)
    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(onLoad).toHaveBeenCalledWith(listWithIndex)
    expect(onDataSourceChange).toHaveBeenCalledTimes(1)
  })

  test('pro table pagination', async () => {
    type Person = {
      name: string
      age: number
    }

    type SearchParams = { score?: number }

    const list = Array.from({ length: 4 }).map<Person>((_, i) => ({
      name: `${Math.random()}`,
      age: i + 1,
    }))

    const fetchTableData = vi.fn(
      ({
        page: { pageNum, pageSize },
      }: FetchProTablePageListQuery<SearchParams>) => {
        return {
          total: list.length,
          data: list.slice(
            (pageNum - 1) * pageSize,
            (pageNum - 1) * pageSize + pageSize
          ),
        }
      }
    )

    let scope: ProTableScope<Person>

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person, SearchParams>(s => {
          scope = s
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            fetchTableData,
            tableProps: {
              pagination: {
                current: 1,
                pageSize: 2,
              },
            },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'add-button',
              // onClick() {
              //   const last = stack.pop()
              //   if (last) {
              //     data.value.push(last)
              //   }
              // },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-empty').length).toBe(0)

    function expectRecord(count: number, pageNum: number, values: string[][]) {
      expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(values.length)

      expect(wrapper.findAllComponents(Pagination).length).toBe(1)
      expect(fetchTableData).toHaveBeenCalledTimes(count)
      expect(fetchTableData).toHaveBeenCalledWith({
        page: {
          pageNum,
          pageSize: 2,
        },
        params: undefined,
      })

      for (let i = 0; i < values.length; ++i) {
        const tr = values[i]
        for (let j = 0; j < tr.length; ++j) {
          const td = tr[j]
          expect(
            wrapper.findAll('.ant-table-tbody tr')[i].findAll('td')[j].text()
          ).toBe(td)
        }
      }
    }

    expectRecord(1, 1, [
      [`${list[0].name}`, '1'],
      [`${list[1].name}`, '2'],
    ])

    await scope!.next()
    await nextTick()

    expectRecord(2, 2, [
      [`${list[2].name}`, '3'],
      [`${list[3].name}`, '4'],
    ])

    await scope!.previous()
    await nextTick()

    expectRecord(3, 1, [
      [`${list[0].name}`, '1'],
      [`${list[1].name}`, '2'],
    ])
  })

  test('renderEmpty', async () => {
    type Person = {
      name: string
      age: number
    }

    const renderEmptyTextFn = vi.fn(() =>
      h('div', { class: 'empty-box' }, 'empty')
    )
    const renderEmptyText = ref()

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            renderEmptyText,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderEmptyText.value = renderEmptyTextFn
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-empty').length).toBe(1)
    expect(renderEmptyTextFn).toHaveBeenCalledTimes(0)

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAll('.ant-empty').length).toBe(0)
    expect(wrapper.findAll('.empty-box').length).toBe(1)
    expect(renderEmptyTextFn).toHaveBeenCalledTimes(1)
  })

  test('renderFooter', async () => {
    type Person = {
      name: string
      age: number
    }

    const renderFooterFn = vi.fn((currentPageData: Person[]) =>
      h('div', { class: 'footer-box' }, `footer: ${currentPageData.length}`)
    )
    const renderFooter = ref()

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            renderFooter,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderFooter.value = renderFooterFn
              },
            }),
            h('button', {
              class: 'data-button',
              onClick() {
                data.value.push({ name: 'Nicholas', age: 30 })
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(renderFooterFn).toHaveBeenCalledTimes(0)

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(renderFooterFn).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.footer-box').length).toBe(1)
    expect(wrapper.findAll('.footer-box')[0].text()).toBe(`footer: 1`)

    const dataButton = wrapper.find('.data-button')
    expect(dataButton.exists()).toBe(true)

    await dataButton.trigger('click')

    expect(renderFooterFn).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('.footer-box').length).toBe(1)
    expect(wrapper.findAll('.footer-box')[0].text()).toBe(`footer: 2`)
  })

  test('renderTitle', async () => {
    type Person = {
      name: string
      age: number
    }

    const renderTitleFn = vi.fn((currentPageData: Person[]) =>
      h('div', { class: 'title-box' }, `title: ${currentPageData.length}`)
    )
    const renderTitle = ref()

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            renderTitle,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderTitle.value = renderTitleFn
              },
            }),
            h('button', {
              class: 'data-button',
              onClick() {
                data.value.push({ name: 'Nicholas', age: 30 })
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(renderTitleFn).toHaveBeenCalledTimes(0)

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(renderTitleFn).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.title-box').length).toBe(1)
    expect(wrapper.findAll('.title-box')[0].text()).toBe(`title: 1`)

    const dataButton = wrapper.find('.data-button')
    expect(dataButton.exists()).toBe(true)

    await dataButton.trigger('click')

    expect(renderTitleFn).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('.title-box').length).toBe(1)
    expect(wrapper.findAll('.title-box')[0].text()).toBe(`title: 2`)
  })

  test('renderSummary', async () => {
    const renderSummaryFn = vi.fn(() =>
      h('div', { class: 'summary-box' }, `summary text`)
    )
    const renderSummary = ref()

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            renderSummary,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderSummary.value = renderSummaryFn
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(renderSummaryFn).toHaveBeenCalledTimes(0)

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(renderSummaryFn).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.summary-box').length).toBe(1)
    expect(wrapper.findAll('.summary-box')[0].text()).toBe(`summary text`)
  })

  test('renderFilterDropdown', async () => {
    // normal filter
    const renderFilterDropdownFn = vi.fn(() =>
      h('div', { class: 'filter-dropdown' }, `dropdown text`)
    )
    const renderFilterDropdown = ref()

    const renderFilterIconFn = vi.fn(() =>
      h('div', { class: 'filter-icon' }, `icon text`)
    )
    const renderFilterIcon = ref()

    // name filter
    const renderNameFilterDropdownFn = vi.fn(() =>
      h('div', { class: 'name-filter-dropdown' }, `name dropdown text`)
    )
    const renderNameFilterDropdown = ref()

    const renderNameFilterIconFn = vi.fn(() =>
      h('div', { class: 'name-filter-icon' }, `name icon text`)
    )
    const renderNameFilterIcon = ref()

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                renderFilterDropdown: renderNameFilterDropdown,
                renderFilterIcon: renderNameFilterIcon,
                columnProps: { customFilterDropdown: true },
              },
              {
                label: '年龄',
                name: 'age',
                columnProps: { customFilterDropdown: true },
              },
              {
                label: '分数',
                name: 'score',
                columnProps: { customFilterDropdown: true },
              },
            ],
            data,
            renderFilterDropdown,
            renderFilterIcon,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'set-button',
              onClick() {
                renderFilterDropdown.value = renderFilterDropdownFn
                renderFilterIcon.value = renderFilterIconFn
                renderNameFilterIcon.value = renderNameFilterIconFn
                renderNameFilterDropdown.value = renderNameFilterDropdownFn
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(renderFilterDropdownFn).toHaveBeenCalledTimes(0)
    expect(renderFilterIconFn).toHaveBeenCalledTimes(0)
    expect(renderNameFilterDropdownFn).toHaveBeenCalledTimes(0)
    expect(renderNameFilterIconFn).toHaveBeenCalledTimes(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(
      wrapper
        .find('.ant-table-thead tr')
        .findAll('th')[0]
        .find('.name-filter-icon')
    )
    expect(
      wrapper.find('.ant-table-thead tr').findAll('th')[1].find('.filter-icon')
    )
    expect(
      wrapper.find('.ant-table-thead tr').findAll('th')[2].find('.filter-icon')
    )

    expect(renderFilterIconFn).toHaveBeenCalledTimes(2)
    expect(renderNameFilterIconFn).toHaveBeenCalledTimes(1)

    expect(renderFilterDropdownFn).toHaveBeenCalledTimes(2)
    expect(renderNameFilterDropdownFn).toHaveBeenCalledTimes(1)
  })

  test('wrapper props', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const wrapperProps = ref<FlexProps>({ gap: 'middle' })
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            wrapperProps,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'set-button',
              onClick() {
                wrapperProps.value.gap = 'small'
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.find('.ant-flex-gap-middle').exists()).toBe(true)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(wrapper.find('.ant-flex-gap-small').exists()).toBe(true)
  })

  test('render wrapper is func', async () => {
    const renderWrapperFn = vi.fn(dom =>
      h('div', { class: 'wrapper-box-1' }, dom)
    )
    const renderWrapper = ref(renderWrapperFn)

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            renderWrapper,
            wrapperProps: { gap: 'middle' },
          }
        })
        return () => {
          return [h(ProTable, proTableBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.find('.wrapper-box-1').exists()).toBe(true)
    expect(renderWrapperFn).toHaveBeenCalledTimes(1)
  })

  test('render wrapper is ref', async () => {
    const renderWrapperFn1 = vi.fn(dom =>
      h('div', { class: 'wrapper-box-1' }, dom)
    )
    const renderWrapperFn2 = vi.fn(dom =>
      h('div', { class: 'wrapper-box-2' }, dom)
    )
    const renderWrapper = ref(renderWrapperFn1)

    const App = defineComponent({
      name: 'App',
      setup() {
        const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data,
            renderWrapper,
            wrapperProps: { gap: 'middle' },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'set-button',
              onClick() {
                renderWrapper.value =
                  renderWrapper.value === renderWrapperFn1
                    ? renderWrapperFn2
                    : renderWrapperFn1
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.find('.wrapper-box-1').exists()).toBe(true)
    expect(wrapper.find('.wrapper-box-2').exists()).toBe(false)
    expect(renderWrapperFn1).toHaveBeenCalledTimes(1)
    expect(renderWrapperFn2).toHaveBeenCalledTimes(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(wrapper.find('.wrapper-box-1').exists()).toBe(false)
    expect(wrapper.find('.wrapper-box-2').exists()).toBe(true)
    expect(renderWrapperFn1).toHaveBeenCalledTimes(1)
    expect(renderWrapperFn2).toHaveBeenCalledTimes(1)
  })
})
