import Component from '@glimmer/component';
import { action } from '@ember/object';

interface NavMenuItemArgs {
	menu: any
	activeNav: string
	changeNav: (nav:string)=>void
}

export default class NavMenuItem extends Component<NavMenuItemArgs> {
	@action
	changeActiveNav(nav:string) {
		this.args.changeNav(nav)
	}
}
