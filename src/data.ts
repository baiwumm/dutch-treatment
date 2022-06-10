
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
export const people = [
    {
        name: '伟',
        value: 'wei'
    },
    {
        name: '肚',
        value: 'du'
    },
    {
        name: '罩',
        value: 'zhao'
    },
    {
        name: '象',
        value: 'xiang'
    },
    {
        name: '黑',
        value: 'hei'
    },
    {
        name: '欧',
        value: 'ou'
    },
    {
        name: '良',
        value: 'liang'
    }
]

export const tableConfig = {
    showSeletion: false,
    showHandler: true,
    showIndexColumn: false,
    isCheckMemory: false,
    showExpand: false,
    showAppend: false,
    handlerConfig: {
        align: "center",
        width: 140,
        fixed: 'right'
    },
}

let pColumns: Array<Object> = [];
people.map((p) => {
    pColumns.push({
        label: p.name,
        prop: p.value,
        width: 80,
        align: "center",
    });
});
export const defaultColumns: any = [
    {
        label: 'id',
        prop: 'id',
        width: 100,
        align: "center"
    },
    {
        label: '日期',
        prop: 'date',
        width: 120,
        align: "center"
    },
    {
        label: '消费说明',
        prop: 'consumerShow',
        width: 120,
        align: "center"
    },
    {
        label: '消费金额（元）',
        prop: 'consumptionAmount',
        width: 150,
        sortable: true,
        align: "center"
    }
]

export const firstColumns = [
    ...defaultColumns, ...pColumns
]

// 生成唯一id
export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

// 存入 localstorage 的数据接口
export interface peopleModel {
    name: string;
    value: string;
}
// 消费数据 Model 接口
export interface consumptionAmountModel {
    id?: string,
    consumerShow: string,
    date: string,
    consumptionAmount: number,
    consumptionPartners: Array<string>
}

export interface SummaryMethodProps<T = consumptionAmountModel> {
    columns: TableColumnCtx<T>[]
    data: T[]
}

export interface SpanMethodProps {
    row: consumptionAmountModel
    column: TableColumnCtx<consumptionAmountModel>
    rowIndex: number
    columnIndex: number
}

export function formatRowspanAndColspan(tableData, tableKey) {
    const newArr = []
    // 分类检出tempList中的数据push到newArr中
    for (let i = 0; i < tableData.length;) {
        let count = 0
        for (let j = i; j < tableData.length; j++) {
            if (tableKey === 'dataType') {
                if (tableData[i].dataType === tableData[j].dataType) {
                    count++
                }
            }
        }
        if (tableKey === 'dataType') {
            newArr.push({
                data: tableData[i].dataType,
                num: count
            })
        }
        i += count
    }
    // 根据此算法，格式化newArr中的数据
    for (let k = 0; k < newArr.length; k++) {
        if (newArr[k].num > 1 || newArr[k].num === 0) {
            for (let w = k; w < newArr[k].num + k - 1; w++) {
                newArr.splice(w + 1, 0, {
                    data: newArr[k].data,
                    num: 0
                })
            }
        }
    }
    return newArr
}


