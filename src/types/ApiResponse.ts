import { IKeyword } from "@/model/domain.Model";

export interface ApiResponse {
    success: boolean;
    message: string;
    keywords?: Array<IKeyword>
}