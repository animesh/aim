import React from 'react';

import { RequestStatusEnum } from 'config/enums/requestStatusEnum';

import { IColumnsOrder } from 'types/services/models/explorer/createAppModel';
import {
  IMetricTrace,
  IParamTrace,
  IRun,
} from 'types/services/models/metrics/runModel';

export interface IRunsProps {
  tableData: IRun<IMetricTrace | IParamTrace>[];
}

export interface IRunsTableProps {
  columnsOrder: IColumnsOrder;
  tableRef: React.RefObject<any>;
  runsList: ITagProps[];
  isInfiniteLoading: boolean;
  hiddenColumns: string[];
  hideSystemMetrics: boolean;
  columns: any;
  tableRowHeight: number;
  requestStatus: RequestStatusEnum;
  onExportTableData: () => void;
  onManageColumns: () => void;
  onColumnsVisibilityChange: (hiddenColumns: string[] | string) => void;
  onTableDiffShow: () => void;
  onRowHeightChange: () => void;
  getLastRunsData: (row: any) => void;
  isLatest?: boolean;
  data: any;
  columnsWidths: { [key: string]: number };
  updateColumnsWidths: (key: string, width: number, isReset: boolean) => void;
  selectedRows: { [key: string]: any };
  onRowSelect: (key: string) => any;
  archiveRuns: (ids: string[], archived: boolean) => void;
  deleteRuns: (ids: string[]) => void;
}
