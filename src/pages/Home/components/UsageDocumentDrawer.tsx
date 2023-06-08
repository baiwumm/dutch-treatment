import { PayCircleFilled, PlusOutlined, RedEnvelopeFilled } from '@ant-design/icons'
import { Alert, Button, Drawer, Space, Tag, Typography } from 'antd'
import { FC } from 'react'

const { Text } = Typography;

type IProps = {
  open: boolean;
  setUsageDrawerFalse: () => void;
}

const UsageDocumentDrawer: FC<IProps> = ({ open, setUsageDrawerFalse }) => {
  return (
    <Drawer title="使用文档" open={open} onClose={setUsageDrawerFalse}>
      <Space direction="vertical">
        <Alert message={<Text strong>该功能适用于多人消费，并计算人均消费</Text>} type="info" />
        <Text>1、点击 <Button size="small" icon={<PlusOutlined />}>添加</Button> 按钮，可以添加消费伙伴，下面的表格中会生成对应的列。</Text>
        <Text>2、点击
          <Button type="primary" size="small" >添加消费数据</Button>
          按钮，可以添加消费数据，填写好 <Text type="warning">消费金额（元）</Text> 和选择 <Text type="warning">消费伙伴</Text>，表格会自动计算人均消费。</Text>
        <Text>3、输入对应伙伴的 <Tag bordered={false} color="magenta" icon={<RedEnvelopeFilled />}>支出</Tag> 金额。</Text>
        <Text>4、<Tag bordered={false} color="processing" icon={<PayCircleFilled />}>合计</Tag> 会根据每个人的消费和支出自动计算结果，
          <span style={{ color: '#cf1322' }}>红色的负数</span> 代表需要补全消费，
          <span style={{ color: '#3f8600' }}>绿色的正数</span> 代表需要回收消费。
        </Text>
        <Text>5、点击 <Button type="primary" size="small" danger>清空数据</Button> 则会重置数据，数据一但清空不可恢复，请谨慎操作！</Text>
      </Space>
    </Drawer>
  )
}
export default UsageDocumentDrawer