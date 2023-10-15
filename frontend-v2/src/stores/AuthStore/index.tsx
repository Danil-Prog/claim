import { makeAutoObservable } from 'mobx';
import { UserApi } from '../../services/Api/UserApi';
import ErrorToast from '../../components/Toast/ErrorToast';

export const isValidUsername = (username: string) =>
	/^[a-zA-Z]{6,20}$/gi.test(username);

export class AuthStore {
	// пока isAuthorized === undefined значит еще не прошла проверка
	isAuthorized?: boolean = undefined;
	username = '';
	usernameError = true;
	usernameProcessing = false;
	password = '';
	passwordProcessing = false;
	showPassword = true;
	authData: string = '';
	access_token: string = '';
	refresh_token?: string = '';

	constructor() {
		makeAutoObservable(this);
		this.clear();
	}

	clear = () => {
		this.username = '';
		this.usernameError = true;
		this.usernameProcessing = false;
		this.password = '';
		this.passwordProcessing = false;
	};

	// @action('Показываем пароль')
	public changeShowPassword = () => {
		this.showPassword = !this.showPassword;
	};

	// @action('Установить статус авторизации')
	setAuthorizationStatus = async (isAuth = false) => {
		this.isAuthorized = isAuth;
	};

	// @action('Обработка ввода логина')
	public onUsernameChange = (text: string) => {
		this.usernameError = !isValidUsername(text);
		this.username = text;
	};

	// @action('Обработка ввода пароля')
	public onPasswordChange = (text: string) => {
		this.password = text;
	};

	// @action('Send username to server')
	public sendUsername = async (username: string, password: string) => {
		try {
			UserApi.authenticate(username, password)
				.then(async response => {
					this.authData = response.data.token;
					await this.setAuthorizationStatus(true);
					console.log(this.authData);
				})
				.catch(error => {
					if (error.response) {
						// Запрос был сделан, и сервер ответил кодом состояния, который
						// выходит за пределы 2xx
						if (error.response.status === 401) {
							ErrorToast('Ошибка!');
						} else {
							ErrorToast(error.response.data.message);
						}
					} else if (error.request) {
						// Запрос был сделан, но ответ не получен
						// `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
						// http.ClientRequest в node.js
						console.log(error.request);
						ErrorToast();
					} else {
						// Произошло что-то при настройке запроса, вызвавшее ошибку
						console.log('Error', error.message);
						ErrorToast();
					}
					console.log(error.config);
				});
			await this.receiveUserInfo();
			return Promise.resolve();
		} catch (error: any) {
			return Promise.reject(error?.body?.message);
		} finally {
			this.usernameProcessing = false;
		}
	};

	// @action('Разавторизация')
	logout = async () => {
		try {
			await this.setAuthorizationStatus(false);
		} catch (error) {}
	};

	public receiveUserInfo = async () => {
		try {
			UserApi.getSelfInfo(this.access_token)
				.then(response => {
					const dataUser = response.data;
					console.log(dataUser);
				})
				.catch(error => {
					if (error.response) {
						// Запрос был сделан, и сервер ответил кодом состояния, который
						// выходит за пределы 2xx
						if (error.response.status === 401) {
							ErrorToast('Ошибка!');
						} else {
							ErrorToast(error.response.data.message);
						}
					} else if (error.request) {
						// Запрос был сделан, но ответ не получен
						// `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
						// http.ClientRequest в node.js
						console.log(error.request);
						ErrorToast();
					} else {
						// Произошло что-то при настройке запроса, вызвавшее ошибку
						console.log('Error', error.message);
						ErrorToast();
					}
					console.log(error.config);
				});
			return true;
		} catch (error: any) {
			ErrorToast(error);
			return false;
		}
	};
}

export default new AuthStore();

export interface IAuthStore extends AuthStore {}
