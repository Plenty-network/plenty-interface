import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';

const seriesOptDefault = {
  lineWidth: 2,
  crosshairMarkerVisible: false,
  priceLineVisible: false,
};

const chartOptDefault = {
  layout: {
    backgroundColor: 'transparent',
  },
  crosshair: {
    vertLine: {
      visible: false,
    },
    horzLine: {
      visible: false,
    },
  },
  leftPriceScale: {
    visible: false,
    borderVisible: false,
  },
  rightPriceScale: {
    visible: false,
    borderVisible: false,
  },
  timeScale: {
    visible: false,
    borderVisible: false,
  },
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  handleScroll: false,
  handleScale: false,
};

const sizeDefault = { width: 160, height: 50 };

const SimpleLineChart = ({
  data,
  seriesOptions = seriesOptDefault,
  chartOptions = chartOptDefault,
  color,
  size = sizeDefault,
  className,
}) => {
  const chartDiv = createRef();

  useEffect(() => {
    if (!chartDiv?.current) return;

    const chart = createChart(chartDiv.current, size);
    chart.applyOptions(chartOptions);
    chart.timeScale().fitContent();

    const lineSeries = chart.addLineSeries({
      ...seriesOptions,
      color,
    });
    lineSeries.setData(data);

    return () => chart.remove();
  }, [data, seriesOptions, chartOptions, size, chartDiv, color]);

  return <div className={className} ref={chartDiv} />;
};

SimpleLineChart.propTypes = {
  chartOptions: PropTypes.object,
  className: PropTypes.string,
  color: PropTypes.string,
  data: PropTypes.array,
  seriesOptions: PropTypes.object,
  size: PropTypes.object,
};

export default SimpleLineChart;
