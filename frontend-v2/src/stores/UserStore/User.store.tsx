import { makeAutoObservable } from 'mobx';

export default class User {
	constructor() {
		makeAutoObservable(this);
	}
}
