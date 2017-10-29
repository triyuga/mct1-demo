import { IBar } from 'magikcraft-lore-ui-bar/dst';
import * as log from '../util/log';
import * as Bar from 'magikcraft-lore-ui-bar';
import * as State from '../State';

const magik = magikcraft.io;
const BGL_BAR_KEY = 'mct1.bar.bgl';

log.info('BGL Bar loading...');

const initialState = State.getState();

export let bar: IBar, subscription;

export function init() {
    if (magik.playerMap.containsKey(BGL_BAR_KEY)) {
        let _bar: IBar = magik.playerMap.get(BGL_BAR_KEY);
        _bar.destroy();
    }
    const bgl = initialState.BGL || 4;
    bar = Bar.bar()
    .text(`BGL: ${initialState.BGL}`)
    .color(Bar.color.GREEN)
    .style(Bar.style.NOTCHED_20)
    .progress(bgl)
    .show();

    magik.playerMap.put(BGL_BAR_KEY, bar);

    if (!subscription){
        let previousState = initialState;

        subscription = State.subscribe(function(state) {
            if (previousState.BGL !== state.BGL) {
                const bgl = state.BGL || 0;
                const bglNum = Math.min(20, bgl);
                const bglString = bglNum.toFixed(1);
                previousState = state;
                bar.progress(bglNum * 5);
                bar.text(`BGL: ${bglString}`);
                bar.color(getBGLColor(bgl));
            }
        });
    }
}

function getBGLColor(bgl: number) {
    if (bgl < 4 || bgl > 8) {
        return Bar.color.RED;
    }
    return Bar.color.GREEN;
}

