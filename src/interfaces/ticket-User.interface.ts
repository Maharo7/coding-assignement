import { User } from "./user.interface";

export interface TicketUser {
    id: number;
    completed: boolean;
    description: string;
    user: User;
}