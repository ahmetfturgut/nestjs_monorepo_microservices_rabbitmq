import { Language } from "@app/common";

export interface IEmailContent {
	subject: string;
	language: Language
	context: object;
	template: string;
	to: string;

}
