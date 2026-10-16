import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";
import courseApi from "../api/courseApi";

describe("HomePage (Courses)", () => {
  const mockProfile = { id: 1, name: "Test User", email: "test@delcom.org" };
  const mockCourses = [
    {
      id: 1,
      user_id: 1,
      title: "Kursus SvelteKit 3",
      description: "Belajar SvelteKit dari awal",
      cover: "https://example.com/cover1.jpg",
      rating: 4.8,
      author: { name: "Test User", photo: null },
      students: [{ id: 1, name: "Test User" }],
    },
    {
      id: 2,
      user_id: 2,
      title: "Belajar TypeScript",
      description: "Dasar dan tingkat lanjut",
      cover: null,
      rating: null,
      author: { name: "Other User", photo: "https://example.com/other.jpg" },
      students: [],
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourses").mockImplementation(() => Promise.resolve());
    vi.spyOn(courseApi, "getCourseById").mockResolvedValue(mockCourses[0] as any);
  });

  it("should not render content if profile is not present", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: { profile: null },
    });
    expect(wrapper.find('[data-testid="add-course-btn"]').exists()).toBe(false);
  });

  it("should render courses and statistics", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Daftar Kursus");
    expect(wrapper.find('[data-testid="total-count"]').text()).toBe("2");
    expect(wrapper.find('[data-testid="my-count"]').text()).toBe("1");
    expect(wrapper.find('[data-testid="enrolled-count"]').text()).toBe("1");
    expect(wrapper.text()).toContain("Kursus SvelteKit 3");
    expect(wrapper.text()).toContain("Belajar TypeScript");
  });

  it("should filter courses by search query", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-input"]');
    await searchInput.setValue("SvelteKit");

    expect(wrapper.text()).toContain("Kursus SvelteKit 3");
    expect(wrapper.text()).not.toContain("Belajar TypeScript");
  });

  it("should handle search with null title and description", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: [
          {
            id: 99,
            title: null,
            description: null,
            user_id: 99,
            author: null,
            students: [],
            cover: null,
            rating: null,
          },
        ],
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-input"]');
    await searchInput.setValue("nonexistent");
    expect(wrapper.text()).toContain("Belum ada Kursus");
  });

  it("should toggle is_me filter on filter buttons click", async () => {
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const setSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockReturnValue(Promise.resolve());

    const myBtn = wrapper.find('[data-testid="filter-my-btn"]');
    await myBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));
    expect(setSpy).toHaveBeenCalledWith("1", "");

    const allBtn = wrapper.find('[data-testid="filter-all-btn"]');
    await allBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));
    expect(setSpy).toHaveBeenCalledWith("", "");
  });

  it("should navigate to detail page when detail link clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const detailLink = wrapper.find('[data-testid="detail-link-1"]');
    await detailLink.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/courses/1");
  });

  it("should open and close edit modal when edit button clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const editBtn = wrapper.find('[data-testid="edit-btn-1"]');
    await editBtn.trigger("click");
    expect(wrapper.find('[data-testid="edit-course-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-change-modal-btn"]');
    if (closeBtn.exists()) {
      await closeBtn.trigger("click");
      await new Promise((r) => setTimeout(r, 10));
      expect(wrapper.find('[data-testid="edit-course-modal"]').exists()).toBe(false);
    }
  });

  it("should open and close add modal when add button clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const addBtn = wrapper.find('[data-testid="add-course-btn"]');
    await addBtn.trigger("click");
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-add-modal-btn"]');
    if (closeBtn.exists()) {
      await closeBtn.trigger("click");
      expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(false);
    }
  });

  it("should call deleteCourse on confirmed delete", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockReturnValue(Promise.resolve());

    const deleteBtn = wrapper.find('[data-testid="delete-btn-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should not call deleteCourse on dismissed delete", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete");

    const deleteBtn = wrapper.find('[data-testid="delete-btn-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should call deleteAllCourses on confirmed delete all", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDeleteAll").mockReturnValue(Promise.resolve());

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));

    expect(deleteAllSpy).toHaveBeenCalled();
  });

  it("should not call deleteAllCourses on dismissed delete all", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDeleteAll");

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 20));

    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should reload when isCourseDeleted or isCourseDeletedAll become true", async () => {
    const { coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const setSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockReturnValue(Promise.resolve());
    setSpy.mockClear();

    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(setSpy).toHaveBeenCalledTimes(1);

    coursesStore.setIsCourseDeletedAll(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it("should render empty state when list is empty or null", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: [],
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Belum ada Kursus");

    const { wrapper: wNull } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: null,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wNull.text()).toContain("Belum ada Kursus");
  });
});

