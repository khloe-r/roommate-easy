import { Timestamp } from "firebase/firestore";

export interface FormattedAnswer {
    question: string;
    answer: string | string[];
    colour: string;
}

export interface ResponseType {
    answers: FormattedAnswer[];
    contact_info: {
        name: string;
        primary_contact_info: string;
        secondary_contact_info: string;
    }
    id: string;
    score: number;
    survey_id: string;
    timestamp: Timestamp;
}
