// src/types.d.ts

declare module "echarts-for-react" {
  import React from "react";

  // 定义组件 Props 类型
  export interface ReactEChartsProps {
    option: any;
    style?: React.CSSProperties;
    className?: string;
    onEvents?: Record<string, (params: any) => void>;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    theme?: string | object;
    loadingOption?: any;
    showLoading?: boolean;
  }

  export default class ReactECharts extends React.Component<ReactEChartsProps> {}
}
