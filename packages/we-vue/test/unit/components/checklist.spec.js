import { shallowMount, mount } from '@vue/test-utils'
import Checklist from '@/components/checklist'

const options = [
  'value1',
  'value2',
  'value3',
]

describe('checklist', () => {
  let wrapper
  afterEach(() => {
    wrapper && wrapper.destroy()
  })

  test('create', () => {
    wrapper = shallowMount(Checklist, {
      propsData: {
        options: options,
      },
    })

    expect(wrapper.name()).toBe('wv-checklist')
    expect(wrapper.contains('.weui-cells_checkbox')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()

    // create with 'title'
    wrapper = shallowMount(Checklist, {
      propsData: {
        title: 'test title',
        options: options,
      },
    })

    expect(wrapper.contains('.weui-cells__title')).toBeTruthy()
    expect(wrapper.find('.weui-cells__title').text()).toBe('test title')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('options', () => {
    wrapper = mount(Checklist, {
      propsData: {
        value: ['value2'],
        options: options,
      },
    })

    expect(wrapper.findAll('.weui-check__label').length).toBe(3)

    expect(wrapper.findAll('.weui-cell__bd p').at(0).text()).toBe('value1')
    expect(wrapper.findAll('.weui-cell__bd p').at(1).text()).toBe('value2')
    expect(wrapper.findAll('.weui-cell__bd p').at(2).text()).toBe('value3')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('max selection', () => {
    wrapper = mount(Checklist, {
      attachToDocument: true,
      propsData: {
        max: 2,
        options: options,
        value: options,
      },
    })

    expect(wrapper.emitted().input[0]).toEqual([['value1', 'value2']])

    // create a fresh wrapper
    wrapper = shallowMount(Checklist, {
      propsData: {
        max: 1,
        options: options,
        value: options,
      },
    })

    expect(wrapper.emitted().input[0]).toEqual([['value1']])
  })

  test('click option', () => {
    wrapper = mount(Checklist, {
      attachToDocument: true,
      propsData: {
        options: [
          'value1',
          'value2',
          {
            label: 'value3',
            disabled: true,
          },
        ],
        value: [],
      },
    })

    // click 'value1'
    wrapper.findAll('.weui-check__label').at(0).trigger('click')
    expect(wrapper.vm.currentValue).toEqual(['value1'])

    // click 'value2'
    wrapper.findAll('.weui-check__label').at(1).trigger('click')
    expect(wrapper.vm.currentValue).toEqual(['value1', 'value2'])

    // click 'value3', it is DISABLED
    wrapper.findAll('.weui-check__label').at(2).trigger('click')
    expect(wrapper.vm.currentValue).toEqual(['value1', 'value2'])
  })

  test('watch currentValue', () => {
    wrapper = shallowMount(Checklist, {
      propsData: {
        max: 2,
        options: options,
      },
    })

    wrapper.setData({
      currentValue: ['value1'],
    })

    expect(wrapper.emitted().input.length).toBe(2)

    wrapper.setData({
      currentValue: options,
    })

    expect(wrapper.emitted().input[2]).toEqual([['value1', 'value2']])
  })

  test('watch value', () => {
    wrapper = shallowMount(Checklist, {
      propsData: {
        options: options,
      },
    })

    wrapper.setProps({
      value: ['new-value'],
    })

    expect(wrapper.emitted().change).toEqual([[['new-value']]])
  })
})
