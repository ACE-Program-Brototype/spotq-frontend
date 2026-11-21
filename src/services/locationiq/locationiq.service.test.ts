import { mapLocationIqToAddress, searchLocationIQ } from "./locationiq.service";

jest.mock("@/config/env", () => ({
  __esModule: true,
  default: {
    locationIqToken: "mock-locationiq-token",
    apiUrl: "http://localhost:10000/api/v1",
  },
}));

describe("locationiq.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("mapLocationIqToAddress", () => {
    it("maps raw LocationIQ response to RestaurantAddress format", () => {
      const mockRaw = {
        place_id: "123",
        lat: "12.9715987",
        lon: "77.5945627",
        display_name: "12, MG Road, Indiranagar, Bengaluru, Karnataka, 560001, India",
        address: {
          house_number: "12",
          road: "MG Road",
          suburb: "Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          postcode: "560001",
          country: "India",
        },
      };

      const result = mapLocationIqToAddress(mockRaw);

      expect(result).toEqual({
        address_line1: "12 MG Road",
        address_line2: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560001",
        latitude: 12.9715987,
        longitude: 77.5945627,
      });
    });

    it("clamps invalid latitude and longitude to bounds", () => {
      const mockRaw = {
        place_id: "123",
        lat: "100.5",
        lon: "-200.5",
        display_name: "Out of bounds place",
      };

      const result = mapLocationIqToAddress(mockRaw);

      expect(result.latitude).toBe(90);
      expect(result.longitude).toBe(-180);
    });
  });

  describe("searchLocationIQ", () => {
    it("returns empty array when query is under 3 characters", async () => {
      const result = await searchLocationIQ("mg");
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("fetches autocomplete suggestions with required parameters", async () => {
      const mockData = [
        {
          place_id: "1",
          lat: "12.97",
          lon: "77.59",
          display_name: "MG Road, Bengaluru",
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await searchLocationIQ("MG Road");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://api.locationiq.com/v1/autocomplete"),
        expect.any(Object),
      );
      expect(result).toEqual(mockData);
    });

    it("handles 404 response as empty array", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await searchLocationIQ("NonexistentPlace");
      expect(result).toEqual([]);
    });
  });
});
