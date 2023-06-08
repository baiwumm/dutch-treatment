import { useMount } from 'ahooks'
import { Card, Col, Form, InputNumber, Modal, Row } from 'antd'
import { LabeledValue } from 'antd/es/select'
import { FC } from 'react'

type IProps = {
  open: boolean;
  setExpenditureModalFalse: () => void;
  localPartners: LabeledValue[] | undefined;
  localExpenditureAmount: Record<string, number> | undefined;
  setLocalExpenditureAmount: (values: Record<string, number>) => void;
}

const AddExpenditureAmount: FC<IProps> = ({
  open,
  setExpenditureModalFalse,
  localPartners = [],
  localExpenditureAmount = {},
  setLocalExpenditureAmount
}) => {
  // 表单实例
  const [form] = Form.useForm();
  // 退出弹窗
  const hanldeCancel = () => {
    setExpenditureModalFalse();
    form.resetFields();
  }
  // 确认回调
  const hanldeComfirm = () => {
    const values: Record<string, number> = form.getFieldsValue(true)
    setLocalExpenditureAmount(values)
    hanldeCancel()
  }

  useMount(() => {
    form.setFieldsValue(localExpenditureAmount)
  })
  return (
    <Modal title="添加支出数据" open={open} onCancel={hanldeCancel} onOk={hanldeComfirm} width={600}>
      <Card>
        <Form form={form} labelCol={{ span: 5 }} labelWrap>
          <Row>
            {
              localPartners.map(partner => (
                <Col span={12} key={partner.value}>
                  <Form.Item
                    name={partner.value}
                    label={partner.label}
                    initialValue={0}
                  >
                    <InputNumber
                      min={0}
                      max={99999999.99}
                      precision={2}
                      prefix="￥"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              ))
            }
          </Row>
        </Form>
      </Card>
    </Modal>
  )
}
export default AddExpenditureAmount