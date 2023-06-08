// 表格配置项
export type TableColumnsProps = {
  userId?: string;
  date: string;
  consumerShow: string;
  consumptionAmount: number;
  consumptionPartners?: React.Key[];
} & Record<string, number>

// 添加消费伙伴
export type AddPartnerFormProps = {
  name: string;
  onlyKey: string;
}