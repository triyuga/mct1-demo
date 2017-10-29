declare var require: any, console: any;
const NanoFlux = require('nanoflux-fusion');

export const fusionStore = NanoFlux.getFusionStore();
export const getState = (): T1State => fusionStore.getState();

interface T1State {
    carbsOnBoard?: number;
    rapidInsulinOnBoard?: number;
    basalInsulinOnBoard?: number;
    BGL?: number;
    effects?: string[];
}

// magikcraft.io.durablePlayerMap.put();

// the 'fusionator' is responsible for the state manipulation
// it is called with two arguments, the previous state
// and an arguments array containing the arguments passed on actor call.
NanoFlux.createFusionator({
    changeBGL: function (previousState, args: number[]) {
        const { BGL } = previousState;
        const delta = args[0];
        const newBGL = BGL + delta;
        return { BGL: newBGL };
    },
    changeRapidInsulin: function (previousState, args: number[]): T1State {
        const { rapidInsulinOnBoard } = previousState;
        const delta = args[0];
        const newRapidInsulinOnBoard = rapidInsulinOnBoard + delta;
        return { rapidInsulinOnBoard: newRapidInsulinOnBoard };
    },
    changeBasalInsulin: function (previousState, args: number[]): T1State {
        const { basalInsulinOnBoard } = previousState;
        const delta = args[0];
        const newBasalInsulinOnBoard = basalInsulinOnBoard + delta;
        return { basalInsulinOnBoard: newBasalInsulinOnBoard };
    },
    changeCarbs: function (previousState, args: number[]): T1State {
        const { carbsOnBoard } = previousState;
        const delta = args[0];
        const newCarbsOnboard = carbsOnBoard + delta;
        return { carbsOnBoard: newCarbsOnboard };
    },
    addEffectMutex: function (previousState, args: string[]): T1State {
        const { effects } = previousState;
        const effect = args[0];
        if (effects.indexOf(effect) != -1) {
            return { effects };
        }
        const newEffects = effects.slice(0);
        newEffects.push(effect);
        return { effects: newEffects };
    },
    removeEffectMutex: function (previousState, args: string[]): T1State {
        const { effects } = previousState;
        const effect = args[0];
        const newEffects = effects.filter(eff => (eff != effect));
        return { effects: newEffects };
    }
},
    // define an initial state!
    {
        BGL: 4,
        rapidInsulinOnBoard: 0,
        basalInsulinOnBoard: 0,
        carbsOnBoard: 0,
        effects: ['NOTHING']
    });

export const changeBGL = NanoFlux.getFusionActor("changeBGL");
export const changeRapidInsulin = NanoFlux.getFusionActor("changeRapidInsulin");
export const changeBasalInsulin = NanoFlux.getFusionActor("changeBasalInsulin");
export const changeCarbs = NanoFlux.getFusionActor("changeCarbs");
export const addEffectMutex = NanoFlux.getFusionActor("addEffectMutex");
export const removeEffectMutex = NanoFlux.getFusionActor("removeEffectMutex");
export const hasEffect = (effect: string) => ((getState().effects as any).indexOf(effect) != -1);
export const subscribe = (callback:(state: T1State) => void) => fusionStore.subscribe(this, callback);