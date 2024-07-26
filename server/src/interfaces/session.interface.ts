import { ObjectId } from "mongoose";

interface Session {
    userId: ObjectId;
    valid?: boolean;
    userAgent: string;
}

export default Session