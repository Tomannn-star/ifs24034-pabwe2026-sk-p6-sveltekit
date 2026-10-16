import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentModal from "./ContentModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ContentModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: false, courseId: "123" },
    });
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(false);
  });

  it("should show validation error if title is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: "123" },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul materi tidak boleh kosong");
  });

  it("should show validation error if youtube is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: "123" },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Judul Materi Baru");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("URL YouTube tidak boleh kosong");
  });

  it("should dispatch asyncSetIsContentAdd when adding content and close on success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: {
        show: true,
        courseId: "123",
        content: null,
        onClose: closeSpy,
      },
      preloadedState: {
        isContentAdd: false,
        isContentAdded: false,
      },
    });

    const addSpy = vi.spyOn(coursesStore, "asyncSetIsContentAdd").mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');

    await titleInput.setValue("Video 1");
    await ytInput.setValue("https://www.youtube.com/watch?v=123");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(addSpy).toHaveBeenCalledWith("123", "Video 1", "https://www.youtube.com/watch?v=123");

    // Simulate completion
    coursesStore.setIsContentAdd(true);
    coursesStore.setIsContentAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isContentAdd true when isContentAdded is false", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: "123" },
      preloadedState: {
        isContentAdd: false,
        isContentAdded: false,
      },
    });

    coursesStore.setIsContentAdd(true);
    coursesStore.setIsContentAdded(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
  });

  it("should dispatch asyncSetIsContentChange when editing existing content", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: {
        show: true,
        courseId: "123",
        content: {
          id: 456,
          title: "Video Lama",
          youtube: "https://youtube.com/old",
        },
        onClose: closeSpy,
      },
      preloadedState: {
        isContentChange: false,
        isContentChanged: false,
      },
    });

    const changeSpy = vi.spyOn(coursesStore, "asyncSetIsContentChange").mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');

    expect((titleInput.element as HTMLInputElement).value).toBe("Video Lama");
    expect((ytInput.element as HTMLInputElement).value).toBe("https://youtube.com/old");

    await titleInput.setValue("Video Baru");
    await ytInput.setValue("https://youtube.com/new");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeSpy).toHaveBeenCalledWith(456, "Video Baru", "https://youtube.com/new");

    // Simulate completion
    coursesStore.setIsContentChange(true);
    coursesStore.setIsContentChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isContentChange true when isContentChanged is false", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: {
        show: true,
        courseId: "123",
        content: { id: 456 },
      },
      preloadedState: {
        isContentChange: false,
        isContentChanged: false,
      },
    });

    coursesStore.setIsContentChange(true);
    coursesStore.setIsContentChanged(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked and handle omitted onClose", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ContentModal, {
      props: {
        show: true,
        courseId: "123",
        onClose: closeSpy,
      },
    });

    const closeBtn = wrapper.find('[data-testid="close-content-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-content-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);

    // Omitted onClose
    const { wrapper: wNoCallback } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: "123" },
    });
    await wNoCallback.find('[data-testid="close-content-modal-btn"]').trigger("click");
    expect(wNoCallback.exists()).toBe(true);
  });
});
