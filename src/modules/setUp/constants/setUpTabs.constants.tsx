// src/modules/setUp/constants/setUpTabs.data.tsx

import { ITabContent, ITabList } from "@/types/share-component.type";
import DeliveryMan from "../deliveryMan/DeliveryMan";
import ExternalDelivery from "../externalDelivery/ExternalDelivery";

export const setUpTabList: ITabList[] = [
  { label: "Delivery Man", value: "deliveryMan" },
  { label: "External Delivery Service", value: "externalDelivery" },
];

export const setUpTabContent: ITabContent[] = [
  { value: "deliveryMan", content: <DeliveryMan /> },
  { value: "externalDelivery", content: <ExternalDelivery /> },
];
