/**
 * @sgratzl/chartjs-chart-boxplot
 * https://github.com/sgratzl/chartjs-chart-boxplot
 *
 * Copyright (c) 2019-2023 Samuel Gratzl <sam@sgratzl.com>
 */

import { Element, ChartType, ScriptableAndArrayOptions, CommonHoverOptions, ScriptableContext, BarController, CartesianScaleTypeRegistry, ControllerDatasetOptions, AnimationOptions, Chart, ChartItem, ChartConfiguration, TooltipModel } from 'chart.js';

interface IStatsBaseOptions {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    outlierStyle: 'circle' | 'triangle' | 'rect' | 'rectRounded' | 'rectRot' | 'cross' | 'crossRot' | 'star' | 'line' | 'dash';
    outlierRadius: number;
    outlierBackgroundColor: string;
    outlierBorderColor: string;
    outlierBorderWidth: number;
    itemStyle: 'circle' | 'triangle' | 'rect' | 'rectRounded' | 'rectRot' | 'cross' | 'crossRot' | 'star' | 'line' | 'dash';
    itemRadius: number;
    itemBackgroundColor: string;
    itemBorderColor: string;
    itemBorderWidth: number;
    hitPadding: number;
    outlierHitRadius: number;
    meanStyle: 'circle' | 'triangle' | 'rect' | 'rectRounded' | 'rectRot' | 'cross' | 'crossRot' | 'star' | 'line' | 'dash';
    meanRadius: number;
    meanBackgroundColor: string;
    meanBorderColor: string;
    meanBorderWidth: number;
}
interface IStatsBaseProps {
    x: number;
    y: number;
    width: number;
    height: number;
    items: number[];
    outliers: number[];
}
declare class StatsBase$1<T extends IStatsBaseProps & {
    mean?: number;
}, O extends IStatsBaseOptions> extends Element<T, O> {
}

interface IBoxAndWhiskersOptions extends IStatsBaseOptions {
    medianColor: string;
    lowerBackgroundColor: string;
}
interface IBoxAndWhiskerProps extends IStatsBaseProps {
    q1: number;
    q3: number;
    median: number;
    whiskerMin: number;
    whiskerMax: number;
    mean: number;
}
declare class BoxAndWiskers extends StatsBase$1<IBoxAndWhiskerProps, IBoxAndWhiskersOptions> {
    static id: string;
}
declare module 'chart.js' {
    interface ElementOptionsByType<TType extends ChartType> {
        boxplot: ScriptableAndArrayOptions<IBoxAndWhiskersOptions & CommonHoverOptions, ScriptableContext<TType>>;
    }
}

interface IBaseStats {
    min: number;
    max: number;
    q1: number;
    q3: number;
    median: number;
    mean: number;
    items: readonly number[];
    outliers: readonly number[];
}
interface IBoxPlot extends IBaseStats {
    whiskerMax: number;
    whiskerMin: number;
}
interface IKDEPoint {
    v: number;
    estimate: number;
}
interface IViolin extends IBaseStats {
    maxEstimate: number;
    coords: IKDEPoint[];
}
type QuantileMethod = 7 | 'quantiles' | 'hinges' | 'fivenum' | 'linear' | 'lower' | 'higher' | 'nearest' | 'midpoint' | ((arr: ArrayLike<number>, length?: number | undefined) => {
    q1: number;
    median: number;
    q3: number;
});
interface IBaseOptions {
    minStats?: 'min' | 'q1' | 'whiskerMin';
    maxStats?: 'max' | 'q3' | 'whiskerMax';
    coef?: number;
    quantiles?: QuantileMethod;
}
type IBoxplotOptions = IBaseOptions;
interface IViolinOptions extends IBaseOptions {
    points: number;
}

type IViolinElementOptions = IStatsBaseOptions;
interface IViolinElementProps extends IStatsBaseProps {
    min: number;
    max: number;
    median: number;
    coords: IKDEPoint[];
    maxEstimate?: number;
}
declare class Violin extends StatsBase$1<IViolinElementProps, IViolinElementOptions> {
    static id: string;
}
declare module 'chart.js' {
    interface ElementOptionsByType<TType extends ChartType> {
        violin: ScriptableAndArrayOptions<IViolinElementOptions & CommonHoverOptions, ScriptableContext<TType>>;
    }
}

declare abstract class StatsBase<S extends IBaseStats, C extends Required<IBaseOptions>> extends BarController {
}

declare class BoxPlotController extends StatsBase<IBoxPlot, Required<IBoxplotOptions>> {
    static readonly id = "boxplot";
}
interface BoxPlotControllerDatasetOptions extends ControllerDatasetOptions, IBoxplotOptions, ScriptableAndArrayOptions<IBoxAndWhiskersOptions, ScriptableContext<'boxplot'>>, ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'boxplot'>>, AnimationOptions<'boxplot'> {
}
type BoxPlotDataPoint = number[] | (Partial<IBoxPlot> & Pick<IBoxPlot, 'min' | 'max' | 'median' | 'q1' | 'q3'>);
interface IBoxPlotChartOptions extends IBoxplotOptions {
}
declare module 'chart.js' {
    interface ChartTypeRegistry {
        boxplot: {
            chartOptions: IBoxPlotChartOptions;
            datasetOptions: BoxPlotControllerDatasetOptions;
            defaultDataPoint: BoxPlotDataPoint;
            scales: keyof CartesianScaleTypeRegistry;
            metaExtensions: {};
            parsedDataType: IBoxPlot & ChartTypeRegistry['bar']['parsedDataType'];
        };
    }
}
declare class BoxPlotChart<DATA extends unknown[] = BoxPlotDataPoint[], LABEL = string> extends Chart<'boxplot', DATA, LABEL> {
    static id: string;
    constructor(item: ChartItem, config: Omit<ChartConfiguration<'boxplot', DATA, LABEL>, 'type'>);
}

declare class ViolinController extends StatsBase<IViolin, Required<IViolinOptions>> {
    static readonly id = "violin";
}
type ViolinDataPoint = number[] | (Partial<IViolin> & Pick<IViolin, 'median' | 'coords'>);
interface ViolinControllerDatasetOptions extends ControllerDatasetOptions, IViolinOptions, ScriptableAndArrayOptions<IViolinElementOptions, ScriptableContext<'violin'>>, ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'violin'>>, AnimationOptions<'violin'> {
}
interface IViolinChartOptions extends IViolinOptions {
}
declare module 'chart.js' {
    interface ChartTypeRegistry {
        violin: {
            chartOptions: IViolinChartOptions;
            datasetOptions: ViolinControllerDatasetOptions;
            defaultDataPoint: ViolinDataPoint;
            scales: keyof CartesianScaleTypeRegistry;
            metaExtensions: {};
            parsedDataType: IViolin & ChartTypeRegistry['bar']['parsedDataType'];
        };
    }
}
declare class ViolinChart<DATA extends unknown[] = ViolinDataPoint[], LABEL = string> extends Chart<'violin', DATA, LABEL> {
    static id: string;
    constructor(item: ChartItem, config: Omit<ChartConfiguration<'violin', DATA, LABEL>, 'type'>);
}

interface ExtendedTooltip extends TooltipModel<'boxplot' | 'violin'> {
    _tooltipOutlier?: {
        index: number;
        datasetIndex: number;
    };
}

export { BoxAndWiskers, BoxPlotChart, BoxPlotController, BoxPlotControllerDatasetOptions, BoxPlotDataPoint, ExtendedTooltip, IBaseOptions, IBaseStats, IBoxAndWhiskerProps, IBoxAndWhiskersOptions, IBoxPlot, IBoxPlotChartOptions, IBoxplotOptions, IKDEPoint, IStatsBaseOptions, IStatsBaseProps, IViolin, IViolinChartOptions, IViolinElementOptions, IViolinElementProps, IViolinOptions, QuantileMethod, StatsBase$1 as StatsBase, Violin, ViolinChart, ViolinController, ViolinControllerDatasetOptions, ViolinDataPoint };
//# sourceMappingURL=index.d.ts.map
