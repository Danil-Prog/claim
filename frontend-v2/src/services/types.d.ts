import { EnumIssueStatus, EnumIssueType, EnumRoles } from './enums';

// Token types

type TokenResponse = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	end_life: string;
	end_refresh: string;
};

// User types

type TUser = {
	id: number;
	username: string;
	password: string;
	role: EnumRoles;
	profile: TUserProfile;
	enabled: boolean;
	authorities: string[];
};

type TUserProfile = {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	avatar: string;
	phone: string;
	cabinet: string;
	pc: string;
	space: TSpace;
};

// Space types

type TSpace = {
	id: number;
	name: string;
	shortName: string;
	image: string;
};

// Issue types

type TIssue = {
	id: 0;
	title: string;
	description: string;
	issueStatus: EnumIssueStatus;
	issueType: EnumIssueType;
	executor: TUser;
};

// Attachment types
