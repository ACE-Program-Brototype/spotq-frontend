import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    navigate("/restaurant/onboarding/review");
  };

  const handleBack = () => {
    navigate("/restaurant/onboarding/documents");
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
          {/* Address Line 1 */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.address_line1 ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="address_line1">Address Line 1*</label>
              </legend>
              <input
                id="address_line1"
                type="text"
                placeholder="Building, street, door no."
                {...register("address_line1")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.address_line1 && (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.address_line1.message}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.address_line2 ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="address_line2">Address Line 2 (Optional)</label>
              </legend>
              <input
                id="address_line2"
                type="text"
                placeholder="Area, landmark, suburb"
                {...register("address_line2")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.address_line2 && (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.address_line2.message}
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.city ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="city">City*</label>
                </legend>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  {...register("city")}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.city && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.state ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="state">State*</label>
                </legend>
                <input
                  id="state"
                  type="text"
                  placeholder="Enter state"
                  {...register("state")}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.state && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Country & Pincode */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.country ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="country">Country*</label>
                </legend>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter country"
                  {...register("country")}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.country && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.pincode ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="pincode">Pincode*</label>
                </legend>
                <input
                  id="pincode"
                  type="text"
                  placeholder="Enter pincode"
                  {...register("pincode")}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.pincode && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.latitude ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="latitude">Latitude (-90 to 90)*</label>
                </legend>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 12.9716"
                  {...register("latitude", { valueAsNumber: true })}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.latitude && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div>
              <fieldset
                className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                  errors.longitude ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                  <label htmlFor="longitude">Longitude (-180 to 180)*</label>
                </legend>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 77.5946"
                  {...register("longitude", { valueAsNumber: true })}
                  className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </fieldset>
              {errors.longitude && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          {/* Attribution */}
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

          {/* Action Buttons */}
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
