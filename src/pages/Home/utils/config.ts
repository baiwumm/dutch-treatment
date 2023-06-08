import { LabeledValue } from 'antd/es/select'
import { map } from 'lodash-es'
export const consumerPartnerMap = [
  {
    label: '伟',
    value: 'wei'
  },
  {
    label: '肚',
    value: 'du'
  },
  {
    label: '罩',
    value: 'zhao'
  },
  {
    label: '象',
    value: 'xiang'
  },
  {
    label: '黑',
    value: 'hei'
  },
  {
    label: '欧',
    value: 'ou'
  },
  {
    label: '良',
    value: 'liang'
  }
];
export const defaultColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    width: 120,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '消费说明',
    dataIndex: 'consumerShow',
    width: 120,
    align: 'center'
  },
  {
    title: '消费金额（元）',
    dataIndex: 'consumptionAmount',
    width: 150,
    align: 'center'
  },
  ...map(
    consumerPartnerMap,
    (item: LabeledValue) => ({
      title: item.label,
      dataIndex: item.value,
      width: 100,
      align: 'center'
    })
  )
];