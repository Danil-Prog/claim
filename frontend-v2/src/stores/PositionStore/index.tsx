import { makeAutoObservable } from 'mobx';

class PositionStore {
	// пока isAuthorized === undefined значит еще не прошла проверка

	state = {
		isSidebar: true
	};

	constructor() {
		makeAutoObservable(this);
	}

	public setIsSidebar = (isSidebar: boolean) => {
		return (this.state.isSidebar = !isSidebar);
	};
}

export default new PositionStore();

export interface IThemeStore extends PositionStore {}
