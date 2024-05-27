import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PayCircleFilled,
  PlusOutlined,
  RedEnvelopeFilled
} from '@ant-design/icons'
import { useBoolean, useLocalStorageState } from 'ahooks'
import { Button, Card, Col, Modal, Row, Space, Tag, Tour, TourProps, Typography } from 'antd';
import { LabeledValue } from 'antd/es/select'
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { filter } from 'lodash-es'
import { FC, useRef, useState } from 'react'

import AddconsumptionData from './components/AddconsumptionData' // 添加消费数据
import AddExpenditureAmount from './components/AddExpenditureAmount' // 添加支出数据
import AddPartnerModal from './components/AddPartnerModal' // 添加消费伙伴 Modal
import ConsumerPartner from './components/ConsumerPartner' // 顶部消费伙伴渲染
import TableTemplate from './components/TableTemplate' // 表格数据
import UsageDocumentDrawer from './components/UsageDocumentDrawer' // 使用文档
import { defaultColumns } from './utils/config'
import { TableColumnsProps } from './utils/interface'

const { Text } = Typography;

const Home: FC = () => {
  // 漫游式引导
  const addPartnerRef = useRef(null) // 添加消费伙伴
  const addConsumptionRef = useRef(null) // 添加消费数据
  const addClearRef = useRef(null) // 清空数据
  const summaryRef = useRef(null) // 合计
  // 引导 steps
  const [openTourSteps, { setTrue: setTourStepsTrue, setFalse: setTourStepsFalse }] = useBoolean(false)
  const tourSteps: TourProps['steps'] = [
    {
      title: '添加消费伙伴',
      description: <Text>点击 <Button size="small" icon={<PlusOutlined />}>添加</Button> 按钮，可以添加消费伙伴，下面的表格中会生成对应的列。</Text>,
      target: () => addPartnerRef.current,
    },
    {
      title: '添加消费数据',
      description: <Text>点击
        <Button type="primary" size="small" >添加消费数据</Button>
        按钮，可以添加消费数据，填写好 <Text type="warning">消费金额（元）</Text> 和选择 <Text type="warning">消费伙伴</Text>，表格会自动计算人均消费。</Text>,
      target: () => addConsumptionRef.current,
    },
    {
      title: '清空数据',
      description: <Text>5、点击 <Button type="primary" size="small" danger>清空数据</Button> 则会重置数据，数据一但清空不可恢复，请谨慎操作！</Text>,
      target: () => addClearRef.current,
    },
    {
      title: '表格统计',
      description: <Space direction="vertical">
        <Text>输入对应伙伴的 <Tag bordered={false} color="magenta" icon={<RedEnvelopeFilled />}>支出</Tag> 金额。</Text>
        <Text><Tag bordered={false} color="processing" icon={<PayCircleFilled />}>合计</Tag> 会根据每个人的消费和支出自动计算结果，
          <span style={{ color: '#cf1322' }}>红色的负数</span> 代表需要补全消费，
          <span style={{ color: '#3f8600' }}>绿色的正数</span> 代表需要回收消费。
        </Text></Space>,
      target: () => summaryRef.current,
    }
  ];
  // 获取 localStorage 消费伙伴数据
  const [localPartners, setLocalPartners] = useLocalStorageState<LabeledValue[]>(
    'consumer-partners',
    {
      defaultValue: [],
    },
  );
  // 获取 localStorage 消费数据
  const [localTableData, setLocalTableData] = useLocalStorageState<TableColumnsProps[]>(
    'table-data',
    {
      defaultValue: [],
    },
  );
  // 获取 localStorage 表格表头
  const [localTableColumns, setLocalTableColumns] = useLocalStorageState<ColumnsType<TableColumnsProps>>(
    'table-columns',
    {
      defaultValue: defaultColumns,
    },
  );
  // 获取 localStorage 支出金额
  const [localExpenditureAmount, setLocalExpenditureAmount] = useLocalStorageState<Record<string, number>>(
    'expenditure-amount'
  );
  // 添加消费伙伴 Modal
  const [openPartnerModal, { setTrue: setPartnerModalTrue, setFalse: setPartnerModalFalse }] = useBoolean(false)
  // 添加消费数据 Modal
  const [openConsumptionModal,
    { setTrue: setConsumptionModalTrue, setFalse: setConsumptionModalFalse }] = useBoolean(false)
  // 编辑时当前数据 userId
  const [userId, setUserId] = useState<string | undefined>('')
  // 使用文档 Drawer
  const [openUsageDrawer, { setTrue: setUsageDrawerTrue, setFalse: setUsageDrawerFalse }] = useBoolean(false)
  // 添加支出数据 Modal
  const [openExpenditureModal, {
    setTrue: setExpenditureModalTrue,
    setFalse: setExpenditureModalFalse
  }] = useBoolean(false)
  // 删除当前数据
  const hanldeDelete = (userId: string) => {
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleFilled />,
      content: '确认删除吗，删除后数据不可恢复？',
      onOk() {
        setLocalTableData(filter(localTableData, (item: TableColumnsProps) => item.userId !== userId))
      },
    });
  }
  // 操作栏
  const actionColumn: ColumnType<TableColumnsProps> = {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        <Button type="primary" icon={<EditOutlined />} ghost size="small" onClick={() => {
          setUserId(record.userId);
          setConsumptionModalTrue();
        }} />
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          danger
          ghost
          size="small"
          onClick={() => hanldeDelete(record.userId || '')}
        />
      </Space>
    ),
  }
  return (
    <Row justify="center">
      <Col flex="1200px">
        <Card>
          {/* 顶部人员 */}
          <ConsumerPartner
            setPartnerModalTrue={setPartnerModalTrue}
            localPartners={localPartners}
            setLocalPartners={setLocalPartners}
            localTableData={localTableData}
            setLocalTableData={setLocalTableData}
            localTableColumns={localTableColumns}
            setLocalTableColumns={setLocalTableColumns}
            addPartnerRef={addPartnerRef}
          />
          {/* 表格 */}
          <TableTemplate
            setConsumptionModalTrue={setConsumptionModalTrue}
            localTableData={localTableData}
            setLocalTableData={setLocalTableData}
            localPartners={localPartners}
            setLocalPartners={setLocalPartners}
            localTableColumns={localTableColumns}
            setLocalTableColumns={setLocalTableColumns}
            actionColumn={actionColumn}
            setUsageDrawerTrue={setUsageDrawerTrue}
            localExpenditureAmount={localExpenditureAmount}
            setExpenditureModalTrue={setExpenditureModalTrue}
            setLocalExpenditureAmount={setLocalExpenditureAmount}
            setTourStepsTrue={setTourStepsTrue}
            addConsumptionRef={addConsumptionRef}
            addClearRef={addClearRef}
            summaryRef={summaryRef}
          />
          {/* 添加消费伙伴 */}
          <AddPartnerModal
            open={openPartnerModal}
            setPartnerModalFalse={setPartnerModalFalse}
            localPartners={localPartners}
            setLocalPartners={setLocalPartners}
            localTableData={localTableData}
            setLocalTableData={setLocalTableData}
            localTableColumns={localTableColumns}
            setLocalTableColumns={setLocalTableColumns}
          />
          {/* 添加消费数据 */}
          {
            openConsumptionModal && <AddconsumptionData
              open={openConsumptionModal}
              setConsumptionModalFalse={setConsumptionModalFalse}
              localPartners={localPartners}
              localTableData={localTableData}
              setLocalTableData={setLocalTableData}
              userId={userId}
              setUserId={setUserId}
            />
          }
          {/* 使用文档 */}
          <UsageDocumentDrawer open={openUsageDrawer} setUsageDrawerFalse={setUsageDrawerFalse} />
          {/* 添加支出数据 */}
          {
            openExpenditureModal && <AddExpenditureAmount
              open={openExpenditureModal}
              setExpenditureModalFalse={setExpenditureModalFalse}
              localPartners={localPartners}
              localExpenditureAmount={localExpenditureAmount}
              setLocalExpenditureAmount={setLocalExpenditureAmount}
            />
          }
          {/* 漫游式引导 */}
          <Tour open={openTourSteps} onClose={setTourStepsFalse} steps={tourSteps} />
        </Card>
      </Col>
    </Row>
  )
}
export default Home