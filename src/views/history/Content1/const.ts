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
        label: '水凝物分类',
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
        label: '中气旋 M',
        children: [
          {
            label: '中气旋 M - 按旋转速度v1.0',
            value: '3000'
          },
          {
            label: '中气旋 M - 按旋转速度v2.0',
            value: '3010'
          },
          {
            label: '中气旋 M - 按涡度',
            value: '3030'
          },
          {
            label: '中气旋 M - ROSE',
            value: '3050'
          }
        ]
      },
      {
        label: '龙卷涡旋特征 TVS',
        children: [
          {
            label: '龙卷涡旋特征 TVS - v1.0',
            value: '3000-2'
          },
          {
            label: '龙卷涡旋特征 TVS - v2.0',
            value: '3010-2'
          },
          {
            label: '龙卷涡旋特征 TVS - ROSE',
            value: '3041'
          }
        ]
      },
      {
        label: '冰雹 Hail',
        children: [
          {
            label: '冰雹 Hail - 按冰雹概率v1.0',
            value: '3000-3'
          },
          {
            label: '冰雹 Hail - 按冰雹概率v2.0',
            value: '3010-3'
          },

          {
            label: '冰雹 Hail - 按尺寸',
            value: '3030-2'
          },

          {
            label: '冰雹 Hail - ROSE',
            value: '3042'
          }
        ]
      },
      {
        label: '下击暴流 Downburst',
        children: [
          {
            label: '下击暴流 Downburst - 按多参量v1.0',
            value: '3000-4'
          },
          {
            label: '下击暴流 Downburst - 按多参量v2.0',
            value: '3010-4'
          },
          {
            label: '下击暴流 Downburst - 按散度',
            value: '3030-3'
          },
          {
            label: '下击暴流 Downburst - ROSE',
            value: '3040'
          }
        ]
      },
      {
        label: '风暴追踪 STI',
        children: [
          {
            label: '风暴追踪 STI - v1.0',
            value: '3000-5'
          },
          {
            label: '风暴追踪 STI - v2.0',
            value: '3010-5'
          }
        ]
      },
      {
        label: '龙卷碎片特征',
        children: [
          {
            label: '龙卷碎片特征 TDS - v1.0',
            value: '3020'
          },
          {
            label: '龙卷碎片特征 TDS - v2.0',
            value: '3030-4'
          }
        ]
      },
      {
        label: '短时强降水 HR',
        children: [
          {
            label: '短时强降水 HR - V3',
            value: '2020-2'
          },
          {
            label: '短时强降水 HR - ROSE',
            value: '3043'
          }
        ]
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

// 给小爽的映射表，她需要知道每个编号对应的产品是什么
const mapList: { label: string; value: string }[] = [
  {
    label: '1h累积降水 OHP - V3',
    value: '2020'
  },
  {
    label: '短时强降水 HR - V3',
    value: '2020-2'
  },
  {
    label: '中气旋 M - 按旋转速度v1.0',
    value: '3000'
  },
  {
    label: '龙卷涡旋特征 TVS - v1.0',
    value: '3000-2'
  },
  {
    label: '冰雹 Hail - 按冰雹概率v1.0',
    value: '3000-3'
  },
  {
    label: '下击暴流 Downburst - 按多参量v1.0',
    value: '3000-4'
  },
  {
    label: '风暴追踪 STI - v1.0',
    value: '3000-5'
  },
  {
    label: '中气旋 M - 按旋转速度v2.0',
    value: '3010'
  },
  {
    label: '龙卷涡旋特征 TVS - v2.0',
    value: '3010-2'
  },
  {
    label: '冰雹 Hail - 按冰雹概率v2.0',
    value: '3010-3'
  },
  {
    label: '下击暴流 Downburst - 按多参量v2.0',
    value: '3010-4'
  },
  {
    label: '风暴追踪 STI - v2.0',
    value: '3010-5'
  },
  {
    label: '中气旋 M - 按涡度',
    value: '3030'
  },
  {
    label: '冰雹 Hail - 按尺寸',
    value: '3030-2'
  },
  {
    label: '下击暴流 Downburst - 按散度',
    value: '3030-3'
  },
  {
    label: '龙卷碎片特征 TDS - v2.0',
    value: '3030-4'
  }
]
