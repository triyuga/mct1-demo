import { Insulin } from '../Insulin/Insulin';

/**
* 5s onset delay
* 30s effect duration
* 30 power
* true = saw-tooth response profile
*/
const rapid = new Insulin(5, 30, 30, true);

/**
 * 5s onset delay
 * 300s effect duration
 * 2 power
 * false = flat response profile
 */
const basal = new Insulin(5, 300, 2, false);

export {
    rapid,
    basal
}