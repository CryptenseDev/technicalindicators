import { IndicatorInput, Indicator } from '../indicator/indicator';
import { ATR } from '../directionalmovement/ATR';
"use strict";
export class SuperTrendInput extends IndicatorInput {
}
;
export class SuperTrend extends Indicator {
    constructor(input) {
        super(input);
        let highs = input.high || [];
        let lows = input.low || [];
        let closes = input.close || [];
        if (!((lows.length === highs.length) && (highs.length === closes.length))) {
            throw ('Inputs(low[' + lows.length + '] ,high[' + highs.length + '], close[' + closes.length + ']) not of equal size');
        }
        var atrProducer = new ATR({ period: input.period, high: [], low: [], close: [], format: (v) => { return v; } });
        this.result = [];
        this.generator = (function* () {
            var result;
            var tick = yield;
            var atr;
            var longStopPrev = null;
            var shortStopPrev = null;
            var lastClose = null;
            var lastDir = null;
            while (true) {
                var { high, low, close } = tick;
                if (lastClose != null) {
                    atr = atrProducer.nextValue(tick);
                    if (atr != undefined) {
                        let longStop = (high + low) / 2.0 - atr * input.factor;
                        let shortStop = (high + low) / 2.0 + atr * input.factor;
                        longStopPrev = (longStopPrev != null) ? longStopPrev : longStop;
                        shortStopPrev = (shortStopPrev != null) ? shortStopPrev : shortStop;
                        longStop = lastClose > longStopPrev ? Math.max(longStop, longStopPrev) : longStop;
                        shortStop = lastClose < shortStopPrev ? Math.min(shortStop, shortStopPrev) : shortStop;
                        let dir = 1;
                        dir = (lastDir != null) ? lastDir : dir;
                        dir = ((dir == -1) && (close) > shortStopPrev) ? 1 :
                            ((dir == 1) && (close) < longStopPrev) ? -1 : dir;
                        result = (dir == 1) ? longStop : shortStop;
                        longStopPrev = longStop;
                        shortStopPrev = shortStop;
                        lastDir = dir;
                    }
                }
                lastClose = close;
                tick = yield result;
            }
        })();
        this.generator.next();
        highs.forEach((tickHigh, index) => {
            var tickInput = {
                high: tickHigh,
                low: lows[index],
                close: closes[index],
            };
            var result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    ;
    nextValue(tickInput) {
        let nextResult = this.generator.next(tickInput);
        if (nextResult.value !== undefined)
            return nextResult.value;
    }
    ;
}
SuperTrend.calculate = supertrend;
export function supertrend(tickInput) {
    Indicator.reverseInputs(tickInput);
    var result = new SuperTrend(tickInput).result;
    if (tickInput.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(tickInput);
    return result;
}
;
