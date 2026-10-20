import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import {
  downloadReceiptAsHtml,
  downloadReceiptAsText,
  generateReceiptHtml,
  generateReceiptText,
} from "./receipt-download.utils";

describe("receipt-download.utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates structured text representation of the receipt", () => {
    const text = generateReceiptText(MOCK_ORDER_RECEIPT);
    expect(text).toContain("SPOTQ DIGITAL RECEIPT");
    expect(text).toContain("Spice Garden Cafe");
    expect(text).toContain("#SQ-101");
    expect(text).toContain("Margherita Pizza");
    expect(text).toContain("Extra Cheese");
    expect(text).toContain("Less spicy please");
    expect(text).toContain("Subtotal:");
    expect(text).toContain("GST & Taxes:");
    expect(text).toContain("Platform Fee:");
    expect(text).toContain("GRAND TOTAL:");
  });

  it("generates HTML representation of the receipt", () => {
    const html = generateReceiptHtml(MOCK_ORDER_RECEIPT);
    expect(html).toContain("Spice Garden Cafe");
    expect(html).toContain("#SQ-101");
    expect(html).toContain("Margherita Pizza");
    expect(html).toContain("Large (12 inch)");
    expect(html).toContain("Extra Cheese");
    expect(html).toContain("Less spicy please");
    expect(html).toContain("Item Subtotal");
    expect(html).toContain("GST & Taxes (5%)");
    expect(html).toContain("Platform Fee");
    expect(html).toContain("Total Paid");
  });

  it("triggers HTML receipt download via Blob and anchor", () => {
    const appendSpy = jest.spyOn(document.body, "appendChild");
    const removeSpy = jest.spyOn(document.body, "removeChild");
    const createUrlSpy = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const revokeUrlSpy = jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    downloadReceiptAsHtml(MOCK_ORDER_RECEIPT);

    expect(createUrlSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(revokeUrlSpy).toHaveBeenCalledWith("blob:mock-url");

    createUrlSpy.mockRestore();
    revokeUrlSpy.mockRestore();
  });

  it("triggers text receipt download via Blob and anchor", () => {
    const appendSpy = jest.spyOn(document.body, "appendChild");
    const removeSpy = jest.spyOn(document.body, "removeChild");
    const createUrlSpy = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const revokeUrlSpy = jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    downloadReceiptAsText(MOCK_ORDER_RECEIPT);

    expect(createUrlSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(revokeUrlSpy).toHaveBeenCalledWith("blob:mock-url");

    createUrlSpy.mockRestore();
    revokeUrlSpy.mockRestore();
  });
});
