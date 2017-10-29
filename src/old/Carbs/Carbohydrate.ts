/**
 * The Carbohydrate class is used to create specific carbohydrate-containing foods.
 *
 * For example:
 *
 * const apple = new Carbohydrate(15);
 *
 * Creates a new food that has 15g of carbohydrates in it.
 * The food has an eat() method, so calling apple.eat() will initiate digestion.
 *
 * Digestion is implemented as a timer loop.
 *
 * @TODO: Glycemic index and glycemic index affect the digestion profile of the
 * food.
 */
import * as State from '../State';
import { Interval } from '../util/timer';

export class Carbohydrate {
    grams: number;
    glycemicIndex: number;
    glycemicLoad: number;
    digestionLoop: number;
    Interval: any;

    constructor (grams: number, glycemicIndex: number = 1, glycemicLoad: number = 1) {
        this.grams = grams;
        this.glycemicIndex = glycemicIndex;
        this.glycemicLoad = glycemicLoad;
    }

    digest(){
        const gramsPerSecond = 1;
        const digestionCoefficient = 0.004;
        // do Digestion
        // Convert some grams to bgl
        const digestedGlucose = Math.min(gramsPerSecond, digestionCoefficient * this.grams * this.glycemicIndex);
        // decrement grams
        this.grams -= gramsPerSecond; // 1gm/sec
        State.changeCarbs(-gramsPerSecond);
        // impact player BGL
        State.changeBGL(digestedGlucose);
        // if grams <= 0; stop digestion
        if (this.grams <= 0) {
            Interval.clearInterval(this.digestionLoop);
        }
    }

    eat() {
        this.digestionLoop = Interval.setInterval(() => this.digest(), 1000);
        State.changeCarbs(this.grams);
    }
}