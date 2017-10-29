import { Dose } from './Dose';
import { Insulin } from './Insulin';

describe('Insulin function', () => {
    test('Rapid insulin function', done => {
        const testDose = new Dose(2, 15, 2, true, tests);
        testDose.test_bgl = 8;
        testDose.test_insulinOnBoard = 1;
        function tests() {
            try {
                //expect(testInsulin.test_insulinOnBoard).toBeLessThan(0.1);
                //expect(testInsulin.test_insulinOnBoard).toBeGreaterThan(0);
                expect(testDose.test_bgl).toBeLessThan(4.1);
                expect(testDose.test_bgl).toBeGreaterThan(3.9);
            } catch (e) {
                done.fail(e);
            }
            done();
        }
        testDose.take(2);
    }, 20000);
})