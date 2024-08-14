type IRadarOptions = {
  label: string
  value?: string
  children?: IRadarOptions
}[]

export const checkLimit = 10

export const radarProductOptions: IRadarOptions = [
  {
    label: '基础产品',
    children: [
      {
        label: '基本反射率',
        children: [
          {
            label: '基本反射率 R - 质控后',
            value: '1000'
          },
          {
            label: '基本反射率 R - 质控前',
            value: '1001'
          }
        ]
      },
      {
        label: '径向速度',
        children: [
          {
            label: '径向速度 V - 质控后',
            value: '1010'
          },
          {
            label: '径向速度 V - 质控前',
            value: '1011'
          }
        ]
      },
      {
        label: '差分反射率因子',
        value: '1020'
      },
      {
        label: '差分相位移',
        value: '1030'
      },
      {
        label: '差分相移率',
        value: '1040'
      },
      {
        label: '相关系数',
        value: '1050'
      },
      {
        label: '谱宽',
        value: '1060'
      }
    ]
  },
  {
    label: '物理量产品',
    children: [
      {
        label: '组合反射率',
        children: [
          {
            label: '组合反射率 CR - V3',
            value: '2000'
          },
          {
            label: '组合反射率 CR - ROSE',
            value: '2001'
          }
        ]
      },
      {
        label: '1h累积降水',
        children: [
          {
            label: '1h累积降水 OHP - V3',
            value: '2020'
          },
          {
            label: '1h累积降水 OHP - ROSE',
            value: '2021'
          }
        ]
      },
      {
        label: '回波顶高',
        children: [
          {
            label: '回波顶高 ET - V3',
            value: '2030'
          },
          {
            label: '回波顶高 ET - ROSE',
            value: '2031'
          }
        ]
      },
      {
        label: '垂直累积液态水含量',
        children: [
          {
            label: '垂直积分液态水含量 VIL - V3',
            value: '2040'
          },
          {
            label: '垂直积分液态水含量 VIL - ROSE',
            value: '2041'
          }
        ]
      },
      {
        label: '径向散度切变',
        value: '2050'
      },
      {
        label: '方位涡度切变',
        value: '2051'
      },
      {
        label: '风场',
        value: '2052'
      },
      {
        label: '粒子相态识别',
        children: [
          {
            label: '水凝物分类 HCL - 模糊逻辑',
            value: '2060'
          },
          {
            label: '水凝物分类 HCL - ROSE',
            value: '2061'
          }
        ]
      },
      {
        label: '降水相态识别',
        value: '2062'
      },
      {
        label: '雨雪相态识别',
        value: '2063'
      }
    ]
  },
  {
    label: '三维数据',
    value: '2100'
  },
  {
    label: '强对流产品',
    children: [
      {
        label: '暴雨所算法V1.0',
        value: '3000'
      },
      {
        label: '暴雨所算法V2.0',
        value: '3010'
      },
      {
        label: '南大TDS算法',
        value: '3020'
      },
      {
        label: '南大风暴算法',
        value: '3030'
      },
      {
        label: 'ROSE-UAM产品',
        children: [
          {
            label: '下击暴流 Downburst - ROSE',
            value: '3040'
          },
          {
            label: '龙卷涡旋特征 TVS - ROSE',
            value: '3041'
          },
          {
            label: '冰雹 Hail - ROSE',
            value: '3042'
          },
          {
            label: '短时强降水 HR - ROSE',
            value: '3043'
          }
        ]
      },
      {
        label: '短强降水V3产品',
        value: 'same-2020'
      },
      {
        label: 'ROSE识别产品',
        value: '3050'
      },
      {
        label: '阵风锋识别',
        value: '3060'
      },
      {
        label: '中气旋追踪',
        value: '4000'
      },
      {
        label: '冰雹追踪',
        value: '4001'
      },
      {
        label: '龙卷追踪',
        value: '4007'
      },
      {
        label: '下击暴流跟踪',
        value: '4008'
      },
      {
        label: '下击暴流时序图',
        value: '4003'
      },
      {
        label: '冰雹时序图',
        value: '4004'
      },
      {
        label: 'TVS时序图',
        children: [
          {
            label: 'TVS时序图v1.0',
            value: '4005'
          },
          {
            label: 'TVS时序图v2.0',
            value: '4006'
          }
        ]
      }
    ]
  }
]
