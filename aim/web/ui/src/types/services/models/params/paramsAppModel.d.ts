import { IGroupingSelectOption } from 'metrics/metricsAppModel';

import { ITableRef } from 'components/Table/Table';
import { IChartPanelRef } from 'components/ChartPanel/ChartPanel';
import { INotification } from 'components/NotificationContainer/NotificationContainer';

import { RequestStatusEnum } from 'config/enums/requestStatusEnum';

import { ITableColumn } from 'pages/metrics/components/TableColumns/TableColumns';

import { IParamTrace, IRun } from 'types/services/models/metrics/runModel';
import {
  IAppModelConfig,
  ISelectOption,
} from 'types/services/models/explorer/createAppModel';

import { IDimensionsType } from 'utils/d3/drawParallelAxes';

import {
  IChartTitleData,
  IMetricsCollection,
} from '../metrics/metricsAppModel';

export interface IParamsAppModelState {
  refs: {
    tableRef?: { current: ITableRef | null };
    chartPanelRef?: { current: IChartPanelRef | null };
  };
  requestStatus: RequestStatusEnum;
  queryIsEmpty: boolean;
  rawData: IRun<IParamTrace>[];
  config: IAppModelConfig;
  data: IMetricsCollection<IParam>[];
  highPlotData: { dimensions: IDimensionsType; data: any }[];
  chartTitleData: IChartTitleData;
  tableData: any[];
  tableColumns: ITableColumn[];
  sameValueColumns: string[];
  params: string[];
  notifyData: INotification[];
  groupingSelectOptions: IGroupingSelectOption[];
  metricsColumns: any;
  selectFormOptions: ISelectOption[];
  selectedRows?: any;
}

export interface IParam {
  run: IRun<IParamTrace>;
  isHidden: boolean;
  color: string;
  key: string;
  dasharray: string;
}
