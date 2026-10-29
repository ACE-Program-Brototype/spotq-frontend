import { Input } from "@/components/ui/input";

interface RestaurantOverviewEditFieldsProps {
  name: string;
  phone: string;
  ownerName: string;
  isSaving: boolean;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onOwnerNameChange: (val: string) => void;
}

export function RestaurantOverviewEditFields({
  name,
  phone,
  ownerName,
  isSaving,
  onNameChange,
  onPhoneChange,
  onOwnerNameChange,
}: RestaurantOverviewEditFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="restaurant-name-input"
          className="block text-xs font-bold text-neutral-700 mb-1"
        >
          Restaurant Name
        </label>
        <Input
          id="restaurant-name-input"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter restaurant name"
          disabled={isSaving}
          className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-phone-input"
            className="block text-xs font-bold text-neutral-700 mb-1"
          >
            Contact Phone
          </label>
          <Input
            id="contact-phone-input"
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Enter contact phone"
            disabled={isSaving}
            className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
          />
        </div>

        <div>
          <label
            htmlFor="owner-name-input"
            className="block text-xs font-bold text-neutral-700 mb-1"
          >
            Owner Name
          </label>
          <Input
            id="owner-name-input"
            type="text"
            value={ownerName}
            onChange={(e) => onOwnerNameChange(e.target.value)}
            placeholder="Enter owner name"
            disabled={isSaving}
            className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
          />
        </div>
      </div>
    </div>
  );
}
