import React from 'react';

import { Grid, GridSize } from '@material-ui/core';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { CHART_TYPES_CONFIG } from 'components/ChartPanel/config';

import CHART_GRID_PATTERN from 'config/chart-grid-pattern/chartGridPattern';
import { GRID_SIZE } from 'config/chart-grid-pattern/chartGridPattern';

import { IChartGridProps } from './ChartGrid.d';

import './ChartGrid.scss';

function ChartGrid({
  data,
  chartType,
  chartRefs = [],
  nameKey,
  chartProps,
  readOnly = false,
  syncHoverState,
}: IChartGridProps): React.FunctionComponentElement<React.ReactNode> {
  function getGridSize(dataLength: number, index: number): GridSize {
    return (
      dataLength > 9 ? GRID_SIZE.S : CHART_GRID_PATTERN[dataLength][index]
    ) as GridSize;
  }
  return (
    <ErrorBoundary>
      {data.map((chartData: any, index: number) => {
        const Component = CHART_TYPES_CONFIG[chartType];
        const gridSize = getGridSize(data.length, index);
        return (
          <Grid key={index} item className='ChartGrid' xs={gridSize}>
            <Component
              ref={chartRefs[index]}
              nameKey={nameKey}
              index={index}
              {...chartProps[index]}
              readOnly={readOnly}
              data={chartData}
              syncHoverState={syncHoverState}
            />
          </Grid>
        );
      })}
    </ErrorBoundary>
  );
}

ChartGrid.displayName = 'ChartGrid';

export default React.memo<IChartGridProps>(ChartGrid);
