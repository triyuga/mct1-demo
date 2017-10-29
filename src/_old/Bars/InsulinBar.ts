import { IBar } from 'magikcraft-lore-ui-bar/dst';
import * as log from '../util/log';
import * as Bar from 'magikcraft-lore-ui-bar';
import * as MCT1State from '../State';

const magik = magikcraft.io;

log.info('Loading Insulin Bar...');

const INSULIN_BAR_KEY = 'mct.bar.insulin';
const initialState = MCT1State.getState();
const basal = initialState.basalInsulinOnBoard || 0;
const textComponent = getBasalMessage(basal);
const amount = initialState.rapidInsulinOnBoard || 0;

export let bar, subscription;

export function init() {
    if (magik.playerMap.containsKey(INSULIN_BAR_KEY)) {
        let _bar: IBar = magik.playerMap.get(INSULIN_BAR_KEY);
        _bar.destroy();
    }
    
    bar = Bar.bar()
        .textComponent(textComponent)
        .color(Bar.color.BLUE)
        .style(Bar.style.NOTCHED_10)
        .progress(amount)
        .show();

    magik.playerMap.put(INSULIN_BAR_KEY, bar);
    let previousState = initialState;
    if (!subscription) {
        subscription = MCT1State.fusionStore.subscribe(this, function (state) {
            log.debug(state);
            if (previousState.basalInsulinOnBoard !== state.basalInsulinOnBoard) {
                const text = getBasalMessage(state.basalInsulinOnBoard);
                bar.textComponent(text);
            }
            if (previousState.rapidInsulinOnBoard !== state.rapidInsulinOnBoard) {
                log.debug(`Insulin onboard: ${state.rapidInsulinOnBoard}`)
                const amount = Math.min(state.rapidInsulinOnBoard, 20);
                bar.progress(Math.min(amount, 100));
            }
            previousState = state;
        });
    }
}
function getBasalMessage(basalInsulinOnBoard: number) {
    if (basalInsulinOnBoard > 0) {
        return Bar.ComponentBuilder("Insulin | ").append("Basal: Active").color(Bar.ChatColor.GREEN).create();
    } else {
        return Bar.ComponentBuilder("Insulin | ").append("Basal: Empty").color(Bar.ChatColor.RED).create();
    }
}

