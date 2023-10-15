import { makeAutoObservable } from 'mobx';

class ThemeStore {
	// пока isAuthorized === undefined значит еще не прошла проверка

	state = {
		theme: 'dark',
		isDark: true
	};

	constructor() {
		makeAutoObservable(this);
	}

	public setTheme = (theme: string) => {
		localStorage.setItem('theme', JSON.stringify(theme));
		this.state.theme = theme;
		this.state.isDark = theme === 'dark';
	};
}

export default new ThemeStore();

export interface IThemeStore extends ThemeStore {}
