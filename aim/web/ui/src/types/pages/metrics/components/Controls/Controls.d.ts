import { IOnSmoothingChange } from 'Metrics';

import { HighlightEnum } from 'components/HighlightModesPopover/HighlightModesPopover';
import { ILine } from 'components/LineChart/LineChart';

import { DensityOptions } from 'config/enums/densityEnum';

import { IAxesScaleState } from 'types/components/AxesScalePopover/AxesScalePopover';
import {
  IAggregationConfig,
  IAlignmentConfig,
  IPanelTooltip,
  IChartZoom,
  IGroupingSelectOption,
} from 'types/services/models/metrics/metricsAppModel';
import { IMetricProps } from 'types/pages/metrics/Metrics';
import { IProjectParamsMetrics } from 'types/services/models/projects/projectsModel';

import { SmoothingAlgorithmEnum } from 'utils/smoothingData';
import { ChartTypeEnum, CurveEnum } from 'utils/d3';

export interface IControlProps {
  chartProps: any[];
  chartType: ChartTypeEnum;
  data: ILine[][] | any;
  selectOptions: IGroupingSelectOption[];
  tooltip: IPanelTooltip;
  ignoreOutliers: boolean;
  zoom?: IChartZoom;
  highlightMode: HighlightEnum;
  aggregationConfig: IAggregationConfig;
  axesScaleType: IAxesScaleState;
  smoothingAlgorithm: SmoothingAlgorithmEnum;
  smoothingFactor: number;
  curveInterpolation: CurveEnum;
  alignmentConfig: IAlignmentConfig;
  densityType: DensityOptions;
  projectsDataMetrics: IProjectParamsMetrics['metric'];
  onChangeTooltip: (tooltip: Partial<IPanelTooltip>) => void;
  onIgnoreOutliersChange: () => void;
  onHighlightModeChange: (mode: number) => void;
  onDensityTypeChange: (type: DensityOptions) => void;
  onSmoothingChange: (props: IOnSmoothingChange) => void;
  onAxesScaleTypeChange: (params: IAxesScaleState) => void;
  onAggregationConfigChange: (
    aggregationConfig: Partial<IAggregationConfig>,
  ) => void;
  onZoomChange?: (zoom: Partial<IChartZoom>) => void;
  onAlignmentTypeChange: IMetricProps['onAlignmentTypeChange'];
  onAlignmentMetricChange: IMetricProps['onAlignmentMetricChange'];
}
