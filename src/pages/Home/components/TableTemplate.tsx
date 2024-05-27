import {
  ExclamationCircleFilled,
  FileTextOutlined,
  PayCircleFilled,
  PushpinOutlined,
  RedEnvelopeFilled
} from '@ant-design/icons'
import { Button, Modal, Space, Statistic, Table, Tag } from 'antd'
import { LabeledValue } from 'antd/es/select'
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { map, reduce, round, subtract, sum, toNumber } from 'lodash-es'
import { FC, RefObject } from 'react'

import { defaultColumns } from '../utils/config'
import { TableColumnsProps } from '../utils/interface'

type IProps = {
  setConsumptionModalTrue: () => void;
  localTableData: TableColumnsProps[] | undefined;
  localPartners: LabeledValue[],
  setLocalPartners: (values: LabeledValue[]) => void;
  localTableColumns: ColumnsType<TableColumnsProps> | undefined;
  setLocalTableColumns: (values: ColumnsType<TableColumnsProps>) => void;
  setLocalTableData: (values: TableColumnsProps[]) => void;
  actionColumn: ColumnType<TableColumnsProps>;
  setUsageDrawerTrue: () => void;
  localExpenditureAmount: Record<string, number> | undefined;
  setExpenditureModalTrue: () => void;
  setLocalExpenditureAmount: (values: Record<string, number>) => void;
  setTourStepsTrue: () => void;
  addConsumptionRef: RefObject<HTMLDivElement>;
  addClearRef: RefObject<HTMLDivElement>;
  summaryRef: RefObject<HTMLDivElement>;
}

const TableTemplate: FC<IProps> = ({
  setConsumptionModalTrue,
  localTableData,
  localTableColumns = [],
  localPartners,
  setLocalPartners,
  setLocalTableColumns,
  setLocalTableData,
  actionColumn,
  setUsageDrawerTrue,
  localExpenditureAmount = {},
  setExpenditureModalTrue,
  setLocalExpenditureAmount,
  setTourStepsTrue,
  addConsumptionRef,
  addClearRef,
  summaryRef
}) => {
  // 清空数据
  const clearData = () => {
    Modal.confirm({
      title: '确认清空数据?',
      icon: <ExclamationCircleFilled />,
      content: '清空数据后，表格中的数据不可恢复，确认清空吗？',
      onOk() {
        // 更新 localstorage 数据
        setLocalPartners([])
        // 清空表格数据
        setLocalTableData([])
        // 设置表头
        setLocalTableColumns(defaultColumns)
        // 清空支出数据
        setLocalExpenditureAmount({})
      },
    });
  }
  // 渲染总结蓝
  const renderSummary = (): React.ReactNode => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {
            localTableColumns.map((column, index) => {
              // 获取当前用户的所有关联数据
              const partnerAmount = localExpenditureAmount[column.dataIndex] || 0
              return <Table.Summary.Cell
                key={index}
                index={index}>
                {![0, 1].includes(index) ?
                  <Statistic
                    value={round(partnerAmount, 2)}
                    precision={2}
                    valueStyle={{ fontSize: 16, color: partnerAmount > 0 ? '#3f8600' : '' }}
                  />
                  : index === 0 ? <Tag bordered={false} color="magenta" icon={<RedEnvelopeFilled />}>支出</Tag> : 'N/A'}
              </Table.Summary.Cell>
            })
          }
          <Table.Summary.Cell index={localTableColumns.length}>
            <Button size="small" onClick={setExpenditureModalTrue} disabled={!localPartners?.length}>编辑</Button>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {
            localTableColumns.map((column, index) => {
              // 获取当前用户的所有关联数据
              const sumAmount = subtract(
                localExpenditureAmount[column.dataIndex],
                sum(map(localTableData, column.dataIndex))
              )
              return <Table.Summary.Cell
                key={index}
                index={index}>
                {![0, 1].includes(index) ?
                  <Statistic
                    value={round(sumAmount, 2)}
                    precision={2}
                    valueStyle={{ fontSize: 16, color: sumAmount < 0 ? '#cf1322' : '#3f8600' }}
                  />
                  : index === 0 ?
                    <Tag bordered={false} color="processing" icon={<PayCircleFilled />}>合计</Tag> : 'N/A'}
              </Table.Summary.Cell>
            })
          }
          <Table.Summary.Cell index={localTableColumns.length}>N/A</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    )
  }
  const scrollX = reduce(
    localTableColumns,
    (sum: number, record: ColumnType<TableColumnsProps>) => sum + (toNumber(record.width) || 100),
    100)
  return (
    <Space direction="vertical" size="small" style={{ display: 'flex', marginTop: 10 }}>
      <Space>
        <Button type="primary" size="small" onClick={setConsumptionModalTrue} ref={addConsumptionRef}>添加消费数据</Button>
        <Button type="primary" size="small" danger onClick={clearData} ref={addClearRef}>清空数据</Button>
        <Button size="small" icon={<PushpinOutlined />} onClick={setTourStepsTrue}>操作引导</Button>
        <Button size="small" icon={<FileTextOutlined />} onClick={setUsageDrawerTrue}>使用文档</Button>
      </Space>
      <Table
        ref={summaryRef}
        rowKey={(record: TableColumnsProps) => record.userId}
        columns={[...(localTableColumns || []), actionColumn]}
        dataSource={localTableData || []}
        size="small"
        pagination={false}
        bordered
        scroll={{ x: scrollX }}
        summary={renderSummary}
      />
    </Space>
  )
}
export default TableTemplate