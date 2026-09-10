import type { BusinessInformationFormValues } from "../schemas/business-information.schema";

export type BusinessInformation = BusinessInformationFormValues;

export interface DocumentItem {
  documentName: string;
  documentKey: string;
}

export interface DocumentsState {
  fssai: DocumentItem | null;
  businessRegistration: DocumentItem | null;
  ownerIdentity: DocumentItem | null;
  gst: DocumentItem | null;
  businessPan: DocumentItem | null;
}

export interface RestaurantImageItem {
  objectKey: string;
  fileName: string;
  displayOrder: number;
}

export interface OnboardState {
  businessInformation: BusinessInformation | null;
  documents: DocumentsState;
  restaurantImages: RestaurantImageItem[];
  setBusinessInformation: (data: BusinessInformation) => void;
  setDocument: (type: keyof DocumentsState, doc: DocumentItem | null) => void;
  setRestaurantImages: (images: RestaurantImageItem[]) => void;
  addRestaurantImage: (image: Omit<RestaurantImageItem, "displayOrder">) => void;
  removeRestaurantImage: (index: number) => void;
  resetOnboardStore: () => void;
}
