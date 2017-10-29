// import { IBar } from 'magikcraft-lore-ui-bar/dst';
import * as log from './old/util/log';
import * as Bar from './Bar';

const magik = magikcraft.io;

const INSULIN_BAR_KEY = 'mct1.bar.insulin';

class InsulinProvider {
	
	constructor() {
		this.set(0);
	}

	set(percent: number) {
		log.info(`Inlsulin.set(${percent})`);
		if (magik.playerMap.containsKey(INSULIN_BAR_KEY)) {
			let _bar = magik.playerMap.get(INSULIN_BAR_KEY);
			_bar.destroy();
		}

		const bar = Bar.bar()
			.text(`Inlsulin: ${percent}`)
			.color(Bar.color.BLUE)
			.style(Bar.style.NOTCHED_20)
			.progress(percent)
			.show();
		
		magik.playerMap.put(INSULIN_BAR_KEY, bar);
	}
}

const Inlsulin = new InsulinProvider();
export default Inlsulin;