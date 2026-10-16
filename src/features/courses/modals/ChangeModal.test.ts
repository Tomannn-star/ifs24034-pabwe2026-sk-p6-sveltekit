import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import courseApi from "../api/courseApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: false, courseId: "123" },
    });
    expect(wrapper.find('[data-testid="edit-course-modal"]').exists()).toBe(false);
  });

  it("should load course data and populate inputs", async () => {
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "Kursus Web",
      description: "Deskripsi kursus web",
    } as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });

    await new Promise((r) => setTimeout(r, 20));

    const titleInput = wrapper.find('[data-testid="change-course-title-input"]');
    const descInput = wrapper.find('[data-testid="change-course-description-input"]');

    expect((titleInput.element as HTMLInputElement).value).toBe("Kursus Web");
    expect((descInput.element as HTMLTextAreaElement).value).toBe("Deskripsi kursus web");
  });

  it("should handle error when course data fetch fails", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));
    vi.spyOn(courseApi, "getCourseById").mockRejectedValue(new Error("Network Error"));
    const closeSpy = vi.fn();

    renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123", onClose: closeSpy },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(errorSpy).toHaveBeenCalledWith("Gagal mengambil data kursus");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle null title or description and null response", async () => {
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: null,
      description: null,
    } as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });

    await new Promise((r) => setTimeout(r, 20));
    expect((wrapper.find('[data-testid="change-course-title-input"]').element as HTMLInputElement).value).toBe("");

    // Test null response
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue(null as any);
    const { wrapper: wNull } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(wNull.exists()).toBe(true);
  });

  it("should show validation error if title is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "",
      description: "Ada deskripsi",
    } as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });

    await new Promise((r) => setTimeout(r, 20));

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul kursus tidak boleh kosong");
  });

  it("should show validation error if description is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "Judul Kursus",
      description: "",
    } as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });

    await new Promise((r) => setTimeout(r, 20));

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi kursus tidak boleh kosong");
  });

  it("should dispatch asyncSetIsCourseChange and call onClose on successful update", async () => {
    const closeSpy = vi.fn();
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "Lama",
      description: "Deskripsi Lama",
    } as any);

    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        courseId: "123",
        onClose: closeSpy,
      },
      preloadedState: {
        isCourseChange: false,
        isCourseChanged: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const changeSpy = vi.spyOn(coursesStore, "asyncSetIsCourseChange").mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="change-course-title-input"]');
    const descInput = wrapper.find('[data-testid="change-course-description-input"]');

    await titleInput.setValue("Judul Baru");
    await descInput.setValue("Deskripsi Baru");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeSpy).toHaveBeenCalledWith("123", "Judul Baru", "Deskripsi Baru");

    // Simulate completion
    coursesStore.setIsCourseChange(true);
    coursesStore.setIsCourseChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isCourseChange true when isCourseChanged is false", async () => {
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "Judul",
      description: "Desc",
    } as any);

    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
      preloadedState: {
        isCourseChange: false,
        isCourseChanged: false,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    coursesStore.setIsCourseChange(true);
    coursesStore.setIsCourseChanged(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="edit-course-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked and handle omitted onClose", async () => {
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue({
      id: "123",
      title: "Lama",
      description: "Deskripsi Lama",
    } as any);

    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        courseId: "123",
        onClose: closeSpy,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const closeBtn = wrapper.find('[data-testid="close-change-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-change-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);

    // Omitted onClose
    const { wrapper: wNoCallback } = renderWithProviders(ChangeModal, {
      props: { show: true, courseId: "123" },
    });
    await new Promise((r) => setTimeout(r, 20));
    await wNoCallback.find('[data-testid="close-change-modal-btn"]').trigger("click");
    expect(wNoCallback.exists()).toBe(true);
  });
});
