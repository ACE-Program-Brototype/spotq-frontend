import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  type BusinessInformationFormValues,
  businessInformationSchema,
} from "../schemas/business-information.schema";
import { useOnboardStore } from "../store/onboard.store";

export default function BusinessInformationPage() {
  const navigate = useNavigate();
  const businessInformation = useOnboardStore((state) => state.businessInformation);
  const setBusinessInformation = useOnboardStore((state) => state.setBusinessInformation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessInformationSchema),
    defaultValues: businessInformation
      ? {
          restaurant_name: businessInformation.restaurant_name,
          phone: businessInformation.phone,
          owner_name: businessInformation.owner_name,
          seating_capacity: businessInformation.seating_capacity as number | undefined,
        }
      : {
          restaurant_name: "",
          phone: "",
          owner_name: "",
          seating_capacity: undefined,
        },
  });

  const onSubmit = (values: BusinessInformationFormValues) => {
    setBusinessInformation(values);
    navigate("/restaurant/onboarding/documents");
  };

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Basic Details</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          {/* Owner's Full Name */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.owner_name ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="owner_name">Owner's Full Name*</label>
              </legend>
              <input
                id="owner_name"
                type="text"
                placeholder="Enter owner's full name"
                autoComplete="name"
                {...register("owner_name")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.owner_name && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.owner_name.message}
              </p>
            )}
          </div>

          {/* Restaurant Name */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.restaurant_name ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="restaurant_name">Restaurant Name*</label>
              </legend>
              <input
                id="restaurant_name"
                type="text"
                placeholder="Enter restaurant name"
                autoComplete="organization"
                {...register("restaurant_name")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.restaurant_name && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.restaurant_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.phone ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="phone">Phone Number*</label>
              </legend>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="Enter phone number"
                autoComplete="tel"
                {...register("phone")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.phone && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Seating Capacity */}
          <div>
            <fieldset
              className={`relative rounded-2xl border px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${
                errors.seating_capacity ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
                <label htmlFor="seating_capacity">Seating Capacity*</label>
              </legend>
              <input
                id="seating_capacity"
                type="number"
                inputMode="numeric"
                min={1}
                max={10000}
                placeholder="Enter seating capacity"
                {...register("seating_capacity")}
                className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </fieldset>
            {errors.seating_capacity && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.seating_capacity.message}
              </p>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
