export type IState = 'state1' | 'state2'

export type IModel =
  | 'model1'
  | 'model2'
  | 'model3'
  | 'model4'
  | 'model5'
  | 'model6'
  | 'model7'
  | 'model8'

export const areaOptions = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]

export const stateOptions: { label: string; value: IState }[] = [
  {
    label: '实时',
    value: 'state1'
  },
  {
    label: '未实时',
    value: 'state2'
  }
]

export const modelOptions: { label: string; value: IModel }[] = [
  {
    label: 'C单偏振',
    value: 'model1'
  },
  {
    label: 'C双偏振',
    value: 'model2'
  },
  {
    label: 'S单偏振',
    value: 'model3'
  },
  {
    label: 'S双偏振',
    value: 'model4'
  },
  {
    label: 'X单偏振',
    value: 'model5'
  },
  {
    label: 'X双偏振',
    value: 'model6'
  },
  {
    label: 'X相控阵',
    value: 'model7'
  },
  {
    label: 'S相控阵',
    value: 'model8'
  }
]

export const tableData = new Array(100).fill({
  date: '2016-05-01',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles'
})
