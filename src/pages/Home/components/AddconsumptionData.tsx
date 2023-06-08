import { useMount } from 'ahooks'
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd'
import { LabeledValue } from 'antd/es/select'
import dayjs from 'dayjs'
import { assign, divide, find, forEach, round, sortBy, unionBy } from 'lodash-es'
import { nanoid } from 'nanoid'
import { FC } from 'react'

import { TableColumnsProps } from '../utils/interface'

type IProps = {
  open: boolean;
  setConsumptionModalFalse: () => void;
  localPartners: LabeledValue[] | undefined;
  localTableData: TableColumnsProps[] | undefined;
  setLocalTableData: (values: TableColumnsProps[]) => void;
  userId: string | undefined;
  setUserId: (value: string) => void;
}

const AddconsumptionData: FC<IProps> = ({
  open,
  setConsumptionModalFalse,
  localPartners,
  localTableData,
  setLocalTableData,
  userId,
  setUserId
}) => {
  // 表单实例
  const [form] = Form.useForm();
  // 退出弹窗
  const hanldeCancel = () => {
    setConsumptionModalFalse();
    form.resetFields();
    setUserId('');
  }
  // 确认回调
  const hanldeComfirm = () => {
    form.validateFields().then((values: TableColumnsProps) => {
      const { date, consumerShow, consumptionAmount, consumptionPartners } = values
      // 生成唯一id
      const nanoUserId = nanoid()
      // 计算人均消费
      const perCapitaAmount = round(divide(consumptionAmount, consumptionPartners?.length || 0), 2)
      const params: TableColumnsProps = {
        date: dayjs(date).format('YYYY-MM-DD'),
        consumerShow,
        consumptionAmount,
      }
      // 给每个人赋值
      forEach(localPartners, (item: LabeledValue) => {
        params[item.value] = consumptionPartners?.includes(item.value) ? perCapitaAmount : 0
      })
      // 判断是回显还是新增
      if (userId) {
        const currentData = { ...find(localTableData, { userId }), ...params }
        const result = sortBy(unionBy([currentData], localTableData, 'userId'), ['date', 'consumptionAmount'])
        setLocalTableData(result)
      } else {
        setLocalTableData(sortBy(
          [...(localTableData || []), assign(params, { userId: nanoUserId })], ['date', 'consumptionAmount'])
        )
      }
      hanldeCancel()
    })
  }

  useMount(() => {
    if (userId) {
      const currentData = find(localTableData, { userId })
      // 消费伙伴回显
      const consumptionPartners: React.Key[] = []
      forEach(localPartners, (item: LabeledValue) => {
        if (currentData[item.value]) {
          consumptionPartners.push(item.value)
        }
      })
      form.setFieldsValue({ ...currentData, consumptionPartners, date: dayjs(currentData.date) })
    }
  })
  return (
    <Modal title="添加消费数据" open={open} onCancel={hanldeCancel} onOk={hanldeComfirm} maskClosable={false}>
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="consumerShow"
          label="消费说明"
          rules={[{ required: true, message: '请输入消费说明' }]}
        >
          <Input placeholder="请输入消费说明" maxLength={20} showCount />
        </Form.Item>
        <Form.Item
          name="consumptionAmount"
          label="消费金额"
          rules={[{ required: true, message: '请输入消费金额' }]}
        >
          <InputNumber
            placeholder="请输入消费金额"
            min={0.01}
            max={99999999.99}
            precision={2}
            prefix="￥"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="consumptionPartners"
          label="消费伙伴"
          rules={[{ required: true, message: '请选择消费伙伴' }]}
        >
          <Select placeholder="请选择消费伙伴" options={localPartners || []} mode="multiple" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AddconsumptionData