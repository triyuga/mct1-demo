// import { IBar } from 'magikcraft-lore-ui-bar/dst';
import * as log from './old/util/log';
import * as Bar from './Bar';

const magik = magikcraft.io;

const BGL_BAR_KEY = 'mct1.bar.bgl';

class BGLProvider {
	state: any;
	
	constructor() {
		this.state = {
			BGL: 4,
		}
	}

	init() {
		// log.info('BGL Bar loading...');
		if (magik.playerMap.containsKey(BGL_BAR_KEY)) {
			let _bar = magik.playerMap.get(BGL_BAR_KEY);
			_bar.destroy();
		}

		const bar = Bar.bar()
			.text(`BGL: ${this.state.BGL}`)
			.color(Bar.color.GREEN)
			.style(Bar.style.NOTCHED_20)
			.progress(this.state.BGL)
			.show();
		
		magik.playerMap.put(BGL_BAR_KEY, bar);
	}

	set(bgl: number) {
		log.info(`BGL.set(${bgl})`);
		if (magik.playerMap.containsKey(BGL_BAR_KEY)) {
			let _bar = magik.playerMap.get(BGL_BAR_KEY);
			_bar.destroy();
		}

		const bar = Bar.bar()
			.text(`BGL: ${bgl}`)
			.color(Bar.color.GREEN)
			.style(Bar.style.NOTCHED_20)
			.progress(bgl)
			.show();
		
		magik.playerMap.put(BGL_BAR_KEY, bar);
	}
}

const BGL = new BGLProvider();
export default BGL;