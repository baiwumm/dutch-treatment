import { Form, Input, Modal, Tag } from 'antd'
import { LabeledValue } from 'antd/es/select'
import type { ColumnsType } from 'antd/es/table';
import { forEach, map } from 'lodash-es'
import { FC } from 'react'

import { AddPartnerFormProps, TableColumnsProps } from '../utils/interface'

type IProps = {
  open: boolean;
  setPartnerModalFalse: () => void;
  localPartners: LabeledValue[] | undefined;
  setLocalPartners: (value: LabeledValue[]) => void;
  localTableData: TableColumnsProps[] | undefined;
  setLocalTableData: (values: TableColumnsProps[]) => void;
  localTableColumns: ColumnsType<TableColumnsProps> | undefined;
  setLocalTableColumns: (values: ColumnsType<TableColumnsProps>) => void;
}

const AddPartnerModal: FC<IProps> = ({
  open,
  setPartnerModalFalse,
  localPartners,
  setLocalPartners,
  localTableData,
  setLocalTableData,
  localTableColumns,
  setLocalTableColumns
}) => {
  // 表单实例
  const [form] = Form.useForm();
  // 退出弹窗
  const hanldeCancel = () => {
    setPartnerModalFalse();
    form.resetFields()
  }
  // 确认回调
  const hanldeComfirm = () => {
    form.validateFields().then((values: AddPartnerFormProps) => {
      // 更新 localstorage 数据
      setLocalPartners([...(localPartners || []), { label: values.name, value: values.onlyKey }])
      // 更新表格
      forEach(localTableData, (item: TableColumnsProps) => {
        item[values.onlyKey] = 0
      })
      setLocalTableData(localTableData || [])
      // 更新表头
      setLocalTableColumns([...(localTableColumns || []), {
        title: values.name,
        dataIndex: values.onlyKey,
        width: 100,
        align: 'center'
      }])
      hanldeCancel()
    })
  }
  return (
    <Modal title="添加消费伙伴" open={open} onCancel={hanldeCancel} onOk={hanldeComfirm} maskClosable={false}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '' },
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('请输入姓名!'));
                } else if (value.length > 4) {
                  return Promise.reject(new Error('名字长度不能大于4!'));
                } else if (map(localPartners, 'label').includes(value)) {
                  return Promise.reject(new Error('名字已存在，请重新输入!'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input placeholder="请输入姓名，例如：张三" maxLength={4} showCount />
        </Form.Item>
        <Form.Item
          name="onlyKey"
          label="唯一Key"
          rules={[
            { required: true, message: '' },
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('请输入唯一Key!'));
                } else if (value.length > 10) {
                  return Promise.reject(new Error('key长度不能大于10!'));
                } else if (map(localPartners, 'value').includes(value)) {
                  return Promise.reject(new Error('唯一key已存在，请重新输入!'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input placeholder="请输入唯一Key，例如：zhangsan" maxLength={10} showCount />
        </Form.Item>
      </Form>
      <Tag color="error">唯一Key建议使用姓名拼音</Tag>
    </Modal>
  )
}
export default AddPartnerModal