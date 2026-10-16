import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";

describe("DetailPage (Courses)", () => {
  const mockProfile = { id: 1, name: "Test User", email: "test@delcom.org" };
  const mockOwnerCourse = {
    id: 101,
    user_id: 1,
    title: "SvelteKit Mastery",
    description: "Pelajari framework SvelteKit 3 secara mendalam",
    cover: "https://example.com/sveltekit.jpg",
    rating: 4.9,
    author: { name: "Test User", photo: "https://example.com/avatar.jpg" },
    students: [
      { id: 2, name: "Student A", email: "studenta@delcom.org", photo: null },
      { id: 3, name: "Student B", email: "studentb@delcom.org", photo: "https://example.com/b.jpg" },
      { id: 4, name: "", email: "", photo: null },
    ],
    contents: [
      { id: 201, title: "Materi 1", youtube: "https://youtube.com/v1", learn: { status: 1 } },
      { id: 202, title: "Materi 2", youtube: "https://youtube.com/v2", learn: { status: 0 } },
    ],
  };

  const mockOtherCourse = {
    id: 102,
    user_id: 99,
    title: "TypeScript Deep Dive",
    description: "",
    cover: null,
    rating: null,
    author: { name: "Other Teacher", photo: "https://example.com/teacher.jpg" },
    students: [
      { id: 1, name: "Test User", email: "test@delcom.org", photo: null },
    ],
    contents: [
      { id: 301, title: "TS Intro", youtube: "https://youtube.com/ts1", learn: { status: 0 } },
    ],
  };

  const mockNotEnrolledCourse = {
    id: 103,
    user_id: 88,
    title: "Python for AI",
    description: null,
    cover: null,
    rating: null,
    author: null,
    students: [],
    contents: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());
  });

  it("should show loading spinner if profile or course is missing", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: { profile: null, course: null },
    });
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("should navigate to home if course is null after fetch", async () => {
    const { coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: { profile: mockProfile, course: null },
    });

    coursesStore.setIsCourse(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockGoto).toHaveBeenCalledWith("/");
  });

  it("should stay on page if course is present when isCourse is true", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: { profile: mockProfile, course: mockOwnerCourse },
    });

    coursesStore.setIsCourse(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.text()).toContain("SvelteKit Mastery");
  });

  it("should render owner view with all owner controls", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: {
        profile: mockProfile,
        course: mockOwnerCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("SvelteKit Mastery");
    expect(wrapper.find('[data-testid="edit-cover-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="add-content-btn"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Anda adalah pemilik kursus ini");
    expect(wrapper.text()).toContain("Materi 1");
    expect(wrapper.text()).toContain("Materi 2");
  });

  it("should handle owner modals open and close", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: {
        profile: mockProfile,
        course: mockOwnerCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    // Cover modal
    await wrapper.find('[data-testid="edit-cover-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="close-cover-modal-btn"]').trigger("click");

    // Edit modal
    await wrapper.find('[data-testid="edit-course-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="edit-course-modal"]').exists()).toBe(true);
    const closeEditBtn = wrapper.find('[data-testid="close-change-modal-btn"]');
    if (closeEditBtn.exists()) await closeEditBtn.trigger("click");

    // Add content modal
    await wrapper.find('[data-testid="add-content-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="close-content-modal-btn"]').trigger("click");

    // Edit content modal
    await wrapper.find('[data-testid="edit-content-btn-201"]').trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="close-content-modal-btn"]').trigger("click");
  });

  it("should handle delete course confirmed and dismissed", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: {
        profile: mockProfile,
        course: mockOwnerCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockReturnValue(Promise.resolve());

    // Dismiss
    await wrapper.find('[data-testid="delete-course-btn"]').trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();

    // Confirm
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: true } as any);
    await wrapper.find('[data-testid="delete-course-btn"]').trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith(101);

    // Simulate completion
    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockGoto).toHaveBeenCalledWith("/");
  });

  it("should handle delete content confirmed and dismissed", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: {
        profile: mockProfile,
        course: mockOwnerCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsContentDelete").mockReturnValue(Promise.resolve());

    // Dismiss
    await wrapper.find('[data-testid="delete-content-btn-201"]').trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();

    // Confirm
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: true } as any);
    await wrapper.find('[data-testid="delete-content-btn-201"]').trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith(201);

    // Simulate completion
    coursesStore.setIsContentDelete(true);
    coursesStore.setIsContentDeleted(true);
    await new Promise((r) => setTimeout(r, 10));

    // Simulate completion with isContentDeleted false
    coursesStore.setIsContentDelete(true);
    coursesStore.setIsContentDeleted(false);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should render enrolled student view and handle leaving course", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 102 },
      preloadedState: {
        profile: mockProfile,
        course: mockOtherCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Anda Terdaftar Sebagai Peserta");

    const leaveSpy = vi.spyOn(coursesStore, "asyncSetIsStudentLeave").mockReturnValue(Promise.resolve());

    // Dismiss leave
    await wrapper.find('[data-testid="leave-course-btn"]').trigger("click");
    expect(leaveSpy).not.toHaveBeenCalled();

    // Confirm leave
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValueOnce({ isConfirmed: true } as any);
    await wrapper.find('[data-testid="leave-course-btn"]').trigger("click");
    expect(leaveSpy).toHaveBeenCalledWith(102);

    // Simulate leave success
    coursesStore.setIsStudentLeave(true);
    coursesStore.setIsStudentLeft(true);
    await new Promise((r) => setTimeout(r, 10));

    // Simulate leave false
    coursesStore.setIsStudentLeave(true);
    coursesStore.setIsStudentLeft(false);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should validate and submit course rating for enrolled student", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => ({} as any));

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 102 },
      preloadedState: {
        profile: mockProfile,
        course: mockOtherCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const ratingSpy = vi.spyOn(coursesStore, "asyncSetIsRatingSubmit").mockReturnValue(Promise.resolve());

    // Empty comment should fail
    await wrapper.find('[data-testid="submit-rating-btn"]').trigger("click");
    expect(errorSpy).toHaveBeenCalledWith("Komentar ulasan tidak boleh kosong!");
    expect(ratingSpy).not.toHaveBeenCalled();

    // Valid comment and rating
    const commentInput = wrapper.find('[data-testid="rating-comment-input"]');
    await commentInput.setValue("Kursus sangat bermanfaat!");

    const ratingSelect = wrapper.find('[data-testid="rating-select"]');
    await ratingSelect.setValue("4");

    await wrapper.find('[data-testid="submit-rating-btn"]').trigger("click");
    expect(ratingSpy).toHaveBeenCalledWith(102, 4, "Kursus sangat bermanfaat!");

    // Simulate rating submitted
    coursesStore.setIsRatingSubmit(true);
    coursesStore.setIsRatingSubmitted(true);
    await new Promise((r) => setTimeout(r, 10));

    // Simulate rating not submitted
    coursesStore.setIsRatingSubmit(true);
    coursesStore.setIsRatingSubmitted(false);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should render non-enrolled view and handle enroll", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 103 },
      preloadedState: {
        profile: mockProfile,
        course: mockNotEnrolledCourse,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Tertarik Mengikuti Kursus Ini?");

    const enrollSpy = vi.spyOn(coursesStore, "asyncSetIsStudentEnroll").mockReturnValue(Promise.resolve());
    await wrapper.find('[data-testid="enroll-course-btn"]').trigger("click");

    expect(enrollSpy).toHaveBeenCalledWith(103);

    // Simulate enroll success
    coursesStore.setIsStudentEnroll(true);
    coursesStore.setIsStudentEnrolled(true);
    await new Promise((r) => setTimeout(r, 10));

    // Simulate enroll false
    coursesStore.setIsStudentEnroll(true);
    coursesStore.setIsStudentEnrolled(false);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should navigate back to home and to content page and handle prop update", async () => {
    const { wrapper, setProps } = renderWithProviders(DetailPage, {
      props: { courseId: 101 },
      preloadedState: {
        profile: mockProfile,
        course: {
          ...mockOwnerCourse,
          author: { name: "Bob Martin", photo: null },
        },
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("B");
    expect(wrapper.text()).toContain("Bob Martin");

    await wrapper.find('[data-testid="back-to-courses-link"]').trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/");

    await wrapper.find('[data-testid="content-link-201"]').trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/courses/101/contents/201");

    // Prop update
    await setProps({ courseId: 105 });
    await new Promise((r) => setTimeout(r, 20));
  });
});
