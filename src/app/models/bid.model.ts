import { load } from "./load.model";
import { status } from "./status.model";

export class bid {
    id?: string;
    userId?: string;
    userCompany?: string;
    userDescription?: string;
    loadId?: string;
    loadDescription?: string;
    loadUserId?: string;
    loadLoadTypeId?: string;
    loadLoadTypeDescription?: string;
    loadNote?: string;
    loadPrice?: number;
    loadOriginatingAddressLabel?: string;
    loadOriginatingAddressLat?: number;
    loadOriginatingAddressLon?: number;
    loadDestinationAddressLabel?: string;
    loadDestinationAddressLat?: number;
    loadDestinationAddressLon?: number;
    loadItemCount?: number;
    loadWeight?: number;
    loadLength?: number;
    loadWidth?: number;
    loadHeight?: number;
    loadTotalValue?: number;
    loadDateOut?: Date;
    loadDateIn?: Date;
    loadDateBidEnd?: Date;
    loadAvatar?: string
    loadStatusId?: string;
    loadStatusDescription?: string;
    vehicleId?: string;
    vehicleDescription?: string;
    driverId?: string;
    driverDescription?: string;
    price?: number;
    dateOut?: Date;
    dateIn?: Date;
    statusId?: string;
    statusDescription?: string;
    reviewLoad?: number;
    reviewLoadCount?: number;
    reviewDriver?: number;
    reviewDriverCount?: number;
    userIdAccepted?: string;
    userIdLoaded?: string;
    userIdLoadedConfirmed?: string;
    userIdDelivered?: string;
    userIdDeliveredConfirmed?: string;
}