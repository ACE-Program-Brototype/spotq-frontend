import type { BusinessInformationFormValues } from "../schemas/business-information.schema";

export type BusinessInformation = BusinessInformationFormValues;

export interface OnboardState {
  businessInformation: BusinessInformation | null;
  setBusinessInformation: (data: BusinessInformation) => void;
  resetOnboardStore: () => void;
}
