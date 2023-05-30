import { status } from "./status.model";
import { user } from "./user.model";

export class tms {
    id?: string;
    userId?: string;
    dateExpiry?: Date;
    tmsPackageId?: string;
    title?: string;
    subTitle?: string;
    link?: string;
    content?: string;
    statusId?: string;
    avatar?: string;
    status?: status;
    user?: user;
}