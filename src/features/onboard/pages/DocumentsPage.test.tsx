import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import * as storageService from "@/services/storage/storage.service";
import { useOnboardStore } from "../store/onboard.store";
import DocumentsPage from "./DocumentsPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/storage/storage.service");

describe("DocumentsPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    useOnboardStore.getState().resetOnboardStore();
    useAuthStore.setState({
      user: {
        email: "test@restaurant.com",
        restaurantId: "123e4567-e89b-12d3-a456-426614174000",
        role: "RESTAURANT_ADMIN",
      },
      accessToken: "mock-token",
      isAuthenticated: true,
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DocumentsPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

  it("renders all 5 document upload fields and restaurant photos section", () => {
    renderComponent();

    expect(screen.getByText("Documents & Photos")).toBeInTheDocument();
    expect(screen.getByText("FSSAI Certificate")).toBeInTheDocument();
    expect(screen.getByText("Business Registration Certificate")).toBeInTheDocument();
    expect(screen.getByText("Owner Identity Proof")).toBeInTheDocument();
    expect(screen.getByText("GST Certificate")).toBeInTheDocument();
    expect(screen.getByText("Business PAN Card")).toBeInTheDocument();
    expect(screen.getByText("Restaurant Photos")).toBeInTheDocument();
  });

  it("shows validation error if Continue is clicked without required uploads", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/please upload all required business documents before proceeding/i),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith("/restaurant/onboarding/location");
  });

  it("validates invalid file type for document upload", async () => {
    renderComponent();

    const file = new File(["dummy image"], "invalid.jpg", { type: "image/jpeg" });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [file] } });

    expect(
      await screen.findByText(/invalid file type. only pdf documents are allowed/i),
    ).toBeInTheDocument();
  });

  it("validates oversized file for document upload", async () => {
    renderComponent();

    // 6MB file
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [largeFile] } });

    expect(await screen.findByText(/file size exceeds the 5mb limit/i)).toBeInTheDocument();
  });

  it("handles successful document upload and updates store state", async () => {
    (storageService.uploadFile as jest.Mock).mockResolvedValue({
      s3ObjectKey: "restaurants/123/documents/fssai_cert.pdf",
      fileName: "fssai_cert.pdf",
    });

    renderComponent();

    const pdfFile = new File(["pdf content"], "fssai_cert.pdf", { type: "application/pdf" });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          file: pdfFile,
          entityType: "restaurants",
          entityId: "123e4567-e89b-12d3-a456-426614174000",
          fileCategory: "DOCUMENTS",
        }),
      );
    });

    expect(await screen.findByText("fssai_cert.pdf")).toBeInTheDocument();
    expect(useOnboardStore.getState().documents.fssai).toEqual({
      documentName: "fssai_cert.pdf",
      documentKey: "restaurants/123/documents/fssai_cert.pdf",
    });
  });

  it("navigates back to business information when Back is clicked", async () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/business-information");
  });

  it("navigates to location page when all documents and photo are uploaded", async () => {
    useOnboardStore.setState({
      documents: {
        fssai: { documentName: "fssai.pdf", documentKey: "key/fssai.pdf" },
        businessRegistration: { documentName: "reg.pdf", documentKey: "key/reg.pdf" },
        ownerIdentity: { documentName: "identity.pdf", documentKey: "key/identity.pdf" },
        gst: { documentName: "gst.pdf", documentKey: "key/gst.pdf" },
        businessPan: { documentName: "pan.pdf", documentKey: "key/pan.pdf" },
      },
      restaurantImages: [{ fileName: "photo1.jpg", objectKey: "key/photo1.jpg", displayOrder: 1 }],
    });

    renderComponent();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/location");
  });

  it("deletes photo from S3 and removes it from state when user clicks remove", async () => {
    (storageService.deleteS3Object as jest.Mock).mockResolvedValue(undefined);

    useOnboardStore.setState({
      restaurantImages: [
        {
          fileName: "restaurant_interior.jpg",
          objectKey: "restaurants/123/images/interior.jpg",
          displayOrder: 1,
        },
      ],
    });

    renderComponent();

    expect(screen.getByText("restaurant_interior.jpg")).toBeInTheDocument();

    const removeButton = screen.getByRole("button", {
      name: /remove photo restaurant_interior\.jpg/i,
    });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(storageService.deleteS3Object).toHaveBeenCalledWith(
        "restaurants/123/images/interior.jpg",
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("restaurant_interior.jpg")).not.toBeInTheDocument();
      expect(useOnboardStore.getState().restaurantImages).toHaveLength(0);
    });
  });

  it("handles S3 deletion failure for photos and retains photo in state", async () => {
    (storageService.deleteS3Object as jest.Mock).mockRejectedValue(
      new Error("Failed to delete S3 object: Access Denied"),
    );

    useOnboardStore.setState({
      restaurantImages: [
        {
          fileName: "restaurant_interior.jpg",
          objectKey: "restaurants/123/images/interior.jpg",
          displayOrder: 1,
        },
      ],
    });

    renderComponent();

    const removeButton = screen.getByRole("button", {
      name: /remove photo restaurant_interior\.jpg/i,
    });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(storageService.deleteS3Object).toHaveBeenCalledWith(
        "restaurants/123/images/interior.jpg",
      );
    });

    expect(
      await screen.findByText(/failed to delete s3 object: access denied/i),
    ).toBeInTheDocument();
    expect(screen.getByText("restaurant_interior.jpg")).toBeInTheDocument();
    expect(useOnboardStore.getState().restaurantImages).toHaveLength(1);
  });

  it("deletes document from S3 and clears document when user clicks remove", async () => {
    (storageService.deleteS3Object as jest.Mock).mockResolvedValue(undefined);

    useOnboardStore.setState({
      documents: {
        fssai: { documentName: "fssai.pdf", documentKey: "restaurants/123/documents/fssai.pdf" },
        businessRegistration: null,
        ownerIdentity: null,
        gst: null,
        businessPan: null,
      },
    });

    renderComponent();

    expect(screen.getByText("fssai.pdf")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: /^remove$/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(storageService.deleteS3Object).toHaveBeenCalledWith(
        "restaurants/123/documents/fssai.pdf",
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("fssai.pdf")).not.toBeInTheDocument();
      expect(useOnboardStore.getState().documents.fssai).toBeNull();
    });
  });

  it("cleans up old document from S3 when user replaces document", async () => {
    (storageService.deleteS3Object as jest.Mock).mockResolvedValue(undefined);
    (storageService.uploadFile as jest.Mock).mockResolvedValue({
      s3ObjectKey: "restaurants/123/documents/fssai_new.pdf",
      fileName: "fssai_new.pdf",
    });

    useOnboardStore.setState({
      documents: {
        fssai: {
          documentName: "fssai_old.pdf",
          documentKey: "restaurants/123/documents/fssai_old.pdf",
        },
        businessRegistration: null,
        ownerIdentity: null,
        gst: null,
        businessPan: null,
      },
    });

    renderComponent();

    const newPdfFile = new File(["new pdf content"], "fssai_new.pdf", { type: "application/pdf" });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [newPdfFile] } });

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalled();
      expect(storageService.deleteS3Object).toHaveBeenCalledWith(
        "restaurants/123/documents/fssai_old.pdf",
      );
    });

    expect(await screen.findByText("fssai_new.pdf")).toBeInTheDocument();
    expect(useOnboardStore.getState().documents.fssai).toEqual({
      documentName: "fssai_new.pdf",
      documentKey: "restaurants/123/documents/fssai_new.pdf",
    });
  });
});
