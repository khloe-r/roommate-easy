import { Timestamp } from "firebase/firestore";

export interface SurveyType {
    created_at: Timestamp;
    place_info: {
        address: string;
        price: string;
        roommates: boolean;
        spots_available: string;
        timeframe: string;
    };
    questions: { [key: string]: string | string[] };
    responses: string[];
    user_id: string;
}