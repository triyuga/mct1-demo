import * as MCT1State from './index';

const TEST_EFFECT = 'CONFUSION';

describe('Test State Reducers', function () {
    test('Test shape of exports', function () {
        expect(MCT1State.fusionStore).toBeTruthy();
        expect(MCT1State.changeBasalInsulin).toBeTruthy();
        expect(MCT1State.changeRapidInsulin).toBeTruthy();
        expect(MCT1State.changeBGL).toBeTruthy();
        expect(MCT1State.changeCarbs).toBeTruthy();
    });
    test('Initial State', function () {
        expect(MCT1State.getState().BGL).toBe(4);
    });
    test('Mutate BGL', function () {
        expect(MCT1State.getState().BGL).toBe(4);
        MCT1State.changeBGL(2);
        expect(MCT1State.getState().BGL).toBe(6);
        MCT1State.changeBGL(-2);
        expect(MCT1State.getState().BGL).toBe(4);
    });
    test('Mutate Carbs', function () {
        expect(MCT1State.getState().carbsOnBoard).toBe(0);
        MCT1State.changeCarbs(20);
        expect(MCT1State.getState().carbsOnBoard).toBe(20);
    });
    test('Mutate Rapid Insulin', function () {
        expect(MCT1State.getState().rapidInsulinOnBoard).toBe(0);
        MCT1State.changeRapidInsulin(12.5);
        expect(MCT1State.getState().rapidInsulinOnBoard).toBe(12.5);
    });
    test('Mutate Basal Insulin', function () {
        expect(MCT1State.getState().basalInsulinOnBoard).toBe(0);
        MCT1State.changeBasalInsulin(14.3);
        expect(MCT1State.getState().basalInsulinOnBoard).toBe(14.3);
    });
    test('Add Effect', function() {
        const initialState: any = MCT1State.getState().effects;
        expect(initialState.length).toBe(1);
        expect(initialState.indexOf('NOTHING')).toBe(0);
        expect(initialState.indexOf(TEST_EFFECT)).toBe(-1);
        expect(MCT1State.hasEffect(TEST_EFFECT)).toBe(false);
        MCT1State.addEffectMutex(TEST_EFFECT);
        const newState: any = MCT1State.getState().effects;
        expect(newState.indexOf(TEST_EFFECT)).not.toBe(-1);
        expect(MCT1State.hasEffect(TEST_EFFECT)).toBe(true);
    });
    test('Remove Effect', function() {
        const initialState: any = MCT1State.getState().effects;
        expect(initialState.indexOf(TEST_EFFECT)).not.toBe(-1);
        expect(MCT1State.hasEffect(TEST_EFFECT)).toBe(true);
        MCT1State.removeEffectMutex(TEST_EFFECT);
        const newState: any = MCT1State.getState().effects;
        expect(newState.indexOf(TEST_EFFECT)).toBe(-1);
        expect(MCT1State.hasEffect(TEST_EFFECT)).toBe(false);
    })
})