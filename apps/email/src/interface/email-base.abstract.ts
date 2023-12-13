import { Language } from "@app/common";

export interface IEmailBase {
    to: string;
    subject: string;
    language: Language;
    getTemplate(): string;
}

