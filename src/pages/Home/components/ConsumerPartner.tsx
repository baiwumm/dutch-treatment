import { ExclamationCircleFilled, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Tag } from 'antd'
import { LabeledValue, SelectValue } from 'antd/es/select'
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { filter, isArray, map, sum } from 'lodash-es'
import { FC, MouseEvent, RefObject } from 'react'

import { TableColumnsProps } from '../utils/interface'

type IProps = {
  setPartnerModalTrue: () => void;
  localPartners: LabeledValue[] | undefined;
  setLocalPartners: (values: LabeledValue[]) => void;
  localTableData: TableColumnsProps[] | undefined;
  setLocalTableData: (values: TableColumnsProps[]) => void;
  localTableColumns: ColumnsType<TableColumnsProps> | undefined;
  setLocalTableColumns: (values: ColumnsType<TableColumnsProps>) => void;
  addPartnerRef: RefObject<HTMLDivElement>;
}

const ConsumerPartner: FC<IProps> = ({
  setPartnerModalTrue,
  localPartners,
  setLocalPartners,
  localTableData = [],
  setLocalTableData,
  localTableColumns,
  setLocalTableColumns,
  addPartnerRef
}) => {
  // 删除标签回调
  const hanldeCloseTag = (e: MouseEvent<HTMLElement>, value: SelectValue) => {
    e.preventDefault()
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleFilled />,
      content: '删除这条数据，表格中的数据也会删除，不可恢复，确认删除吗？',
      onOk() {
        // 获取当前用户的所有关联数据
        const currentUserData = map(localTableData, value)
        // 如果有关联数据，则不能删除
        if (sum(currentUserData) > 0) {
          Modal.error({
            title: '当前伙伴有关联数据',
            content: '有关联数据的伙伴不能删除，必须把关联数据清空才能删除',
          });
        } else {
          // 更新 localstorage 数据
          setLocalPartners(filter(localPartners, (item: LabeledValue) => item.value !== value))
          // 更新表格数据
          localTableData.forEach(item => {
            if (value && !isArray(value)) {
              delete item[value]
            }
          })
          setLocalTableData(localTableData)
          // 更新表头
          setLocalTableColumns(filter(localTableColumns,
            (item: ColumnType<TableColumnsProps>) => item.dataIndex !== value))
        }
      },
    });
  }

  return (
    <Space size={[0, 8]} wrap>
      <span>本次参与消费的伙伴有：</span>
      {
        localPartners?.map(item =>
          <Tag
            key={item.value}
            closable={localPartners.length > 1}
            color="blue"
            icon={<UserOutlined />}
            bordered={false}
            onClose={(e) => hanldeCloseTag(e, item.value)}
          >
            {item.label}
          </Tag>)
      }
      <Button size="small" icon={<PlusOutlined />} onClick={setPartnerModalTrue} ref={addPartnerRef}>添加</Button>
    </Space>
  )
}
export default ConsumerPartner