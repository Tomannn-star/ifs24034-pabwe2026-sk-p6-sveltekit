import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: false, courseId: "123" },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(false);
  });

  it("should show validation error if submitted without selecting a file", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, courseId: "123" },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Silakan pilih cover baru!");

    // Empty files trigger
    const fileInput = wrapper.find('[data-testid="course-cover-input"]');
    await fileInput.trigger("change");
  });

  it("should validate file type", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, courseId: "123" },
    });

    const fileInput = wrapper.find('[data-testid="course-cover-input"]');
    const badFile = new File(["dummy text"], "test.txt", { type: "text/plain" });

    Object.defineProperty(fileInput.element, "files", {
      value: [badFile],
      writable: true,
    });
    await fileInput.trigger("change");

    expect(errorSpy).toHaveBeenCalledWith("Pilih file gambar (JPG/PNG)!");
  });

  it("should validate file size exceeding 1MB", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, courseId: "123" },
    });

    const fileInput = wrapper.find('[data-testid="course-cover-input"]');
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });

    Object.defineProperty(fileInput.element, "files", {
      value: [largeFile],
      writable: true,
    });
    await fileInput.trigger("change");

    expect(errorSpy).toHaveBeenCalledWith("Ukuran gambar maksimal 1MB!");
  });

  it("should handle valid file and submit change cover", async () => {
    const closeSpy = vi.fn();
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");

    const { wrapper, coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: {
        show: true,
        courseId: "123",
        onClose: closeSpy,
      },
      preloadedState: {
        isCourseChangeCover: false,
        isCourseChangedCover: false,
      },
    });

    const coverSpy = vi.spyOn(coursesStore, "asyncSetIsCourseChangeCover").mockReturnValue(Promise.resolve());

    const fileInput = wrapper.find('[data-testid="course-cover-input"]');
    const validFile = new File(["img data"], "cover.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput.element, "files", {
      value: [validFile],
      writable: true,
    });
    await fileInput.trigger("change");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(coverSpy).toHaveBeenCalledWith("123", validFile);

    // Simulate completion
    coursesStore.setIsCourseChangeCover(true);
    coursesStore.setIsCourseChangedCover(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
    URL.createObjectURL = originalCreateObjectURL;
  });

  it("should handle isCourseChangeCover true when isCourseChangedCover is false", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, courseId: "123" },
      preloadedState: {
        isCourseChangeCover: false,
        isCourseChangedCover: false,
      },
    });

    coursesStore.setIsCourseChangeCover(true);
    coursesStore.setIsCourseChangedCover(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: {
        show: true,
        courseId: "123",
        onClose: closeSpy,
      },
    });

    const closeBtn = wrapper.find('[data-testid="close-cover-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-cover-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, courseId: "123" },
    });

    const closeBtn = wrapper.find('[data-testid="close-cover-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });
});
