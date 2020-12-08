import { IndicatorInput, Indicator } from '../indicator/indicator';
export declare class SuperTrendInput extends IndicatorInput {
    factor: number;
    period: number;
    high: number[];
    low: number[];
    close: number[];
}
export declare class SuperTrend extends Indicator {
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: SuperTrendInput);
    static calculate: typeof supertrend;
    nextValue(tickInput: SuperTrendInput): number;
}
export declare function supertrend(tickInput: SuperTrendInput): number[];
