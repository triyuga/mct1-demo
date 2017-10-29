import { Carbohydrate } from './Carbohydrate';

/**
 * Foods - Carbohydrate(grams, GI, GL);
 */

export const Food  = new Object({
    get apple() {
        return new Carbohydrate(15, 5, 5);
    }
}) as {[key: string]: Carbohydrate};
