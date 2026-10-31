import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { FormField, FormInput } from "@/components/common/form";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { type LocationFormValues, locationSchema } from "../schemas/location.schema";
import { useOnboardStore } from "../store/onboard.store";
import type { RestaurantAddress } from "../types/onboard.types";

export default function LocationPage() {
  const navigate = useNavigate();
  const location = useOnboardStore((state) => state.location);
  const setLocation = useOnboardStore((state) => state.setLocation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: location
      ? {
          address_line1: location.address_line1,
          address_line2: location.address_line2 || "",
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode,
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : {
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
          latitude: 0,
          longitude: 0,
        },
  });

  const handleSelectLocation = (address: RestaurantAddress) => {
    reset({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      country: address.country || "India",
      pincode: address.pincode,
      latitude: address.latitude,
      longitude: address.longitude,
    });
  };

  const onSubmit = (values: LocationFormValues) => {
    setLocation(values);
    navigate(RESTAURANT_ROUTES.ONBOARDING.REVIEW);
  };

  const handleBack = () => {
    navigate(RESTAURANT_ROUTES.ONBOARDING.DOCUMENTS);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Location Details</h2>
        <p className="mt-1.5 text-sm text-neutral-600">
          Search and verify your restaurant address and geographical coordinates.
        </p>

        {/* Autocomplete Search Input */}
        <div className="mt-6">
          <LocationAutocomplete
            onSelectLocation={handleSelectLocation}
            defaultValue={location?.address_line1 || ""}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <FormField
            id="address_line1"
            label="Address Line 1"
            required
            error={errors.address_line1?.message}
          >
            <FormInput
              id="address_line1"
              type="text"
              placeholder="Building, street, door no."
              error={Boolean(errors.address_line1)}
              {...register("address_line1")}
            />
          </FormField>

          <FormField
            id="address_line2"
            label="Address Line 2 (Optional)"
            error={errors.address_line2?.message}
          >
            <FormInput
              id="address_line2"
              type="text"
              placeholder="Area, landmark, suburb"
              error={Boolean(errors.address_line2)}
              {...register("address_line2")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="city" label="City" required error={errors.city?.message}>
              <FormInput
                id="city"
                type="text"
                placeholder="Enter city"
                error={Boolean(errors.city)}
                {...register("city")}
              />
            </FormField>

            <FormField id="state" label="State" required error={errors.state?.message}>
              <FormInput
                id="state"
                type="text"
                placeholder="Enter state"
                error={Boolean(errors.state)}
                {...register("state")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="country" label="Country" required error={errors.country?.message}>
              <FormInput
                id="country"
                type="text"
                placeholder="Enter country"
                error={Boolean(errors.country)}
                {...register("country")}
              />
            </FormField>

            <FormField id="pincode" label="Pincode" required error={errors.pincode?.message}>
              <FormInput
                id="pincode"
                type="text"
                placeholder="Enter pincode"
                error={Boolean(errors.pincode)}
                {...register("pincode")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="latitude"
              label="Latitude (-90 to 90)"
              required
              error={errors.latitude?.message}
            >
              <FormInput
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 12.9716"
                error={Boolean(errors.latitude)}
                {...register("latitude", { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              id="longitude"
              label="Longitude (-180 to 180)"
              required
              error={errors.longitude?.message}
            >
              <FormInput
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. 77.5946"
                error={Boolean(errors.longitude)}
                {...register("longitude", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <p className="text-[11px] text-neutral-400 text-center pt-1">
            Search powered by{" "}
            <a
              href="https://locationiq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-600"
            >
              LocationIQ
            </a>
          </p>

          <div className="mt-8 flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-2xl border border-neutral-300 bg-white py-3.5 text-base font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
