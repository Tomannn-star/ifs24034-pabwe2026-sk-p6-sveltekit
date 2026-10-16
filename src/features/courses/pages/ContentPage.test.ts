import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentPage from "./ContentPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";

describe("ContentPage (Video Learning)", () => {
  const mockProfile = { id: 1, name: "Test User", email: "test@delcom.org" };
  const mockContentNotLearned = {
    id: 501,
    course_id: 101,
    title: "Video Pengenalan SvelteKit",
    youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    learn: { status: 0 },
  };

  const mockContentLearned = {
    id: 502,
    course_id: 101,
    title: "Video Lanjutan Runes",
    youtube: "https://youtu.be/dQw4w9WgXcQ",
    learn: { status: 1 },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(coursesStore, "asyncSetContent").mockImplementation(() => Promise.resolve());
  });

  it("should show loading spinner if profile or content is missing", () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 501 },
      preloadedState: { profile: null, content: null },
    });
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("should navigate back to course detail if content is null after fetch", async () => {
    const { coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 501 },
      preloadedState: { profile: mockProfile, content: null },
    });

    coursesStore.setIsContent(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockGoto).toHaveBeenCalledWith("/courses/101");
  });

  it("should stay on page when isContent is true and content exists", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 501 },
      preloadedState: { profile: mockProfile, content: mockContentNotLearned },
    });

    coursesStore.setIsContent(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.text()).toContain("Video Pengenalan SvelteKit");
  });

  it("should render content, iframe embed, and handle learn toggle from unlearned to learned", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 501 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentNotLearned,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Video Pengenalan SvelteKit");
    const iframe = wrapper.find('[data-testid="youtube-iframe"]');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");

    const toggleSpy = vi.spyOn(coursesStore, "asyncSetIsLearnStatusChange").mockReturnValue(Promise.resolve());

    const toggleBtn = wrapper.find('[data-testid="toggle-learn-btn"]');
    expect(toggleBtn.text()).toContain("Tandai Selesai Dipelajari");
    await toggleBtn.trigger("click");

    expect(toggleSpy).toHaveBeenCalledWith(501, 1);

    // Simulate completion with isLearnStatusChanged true
    coursesStore.setIsLearnStatusChange(true);
    coursesStore.setIsLearnStatusChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    // Simulate completion with isLearnStatusChanged false
    coursesStore.setIsLearnStatusChange(true);
    coursesStore.setIsLearnStatusChanged(false);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should handle learn toggle from learned to unlearned", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 502 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentLearned,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Video Lanjutan Runes");
    const toggleSpy = vi.spyOn(coursesStore, "asyncSetIsLearnStatusChange").mockReturnValue(Promise.resolve());

    const toggleBtn = wrapper.find('[data-testid="toggle-learn-btn"]');
    expect(toggleBtn.text()).toContain("Selesai Dipelajari (Klik untuk Batal)");
    await toggleBtn.trigger("click");

    expect(toggleSpy).toHaveBeenCalledWith(502, 0);
  });

  it("should handle back button navigation", async () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 501 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentNotLearned,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const backLink = wrapper.find('[data-testid="back-to-detail-link"]');
    await backLink.trigger("click");

    expect(mockGoto).toHaveBeenCalledWith("/courses/101");
  });

  it("should handle content with already embed URL or custom non-youtube URL", async () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 999 },
      preloadedState: {
        profile: mockProfile,
        content: {
          id: 999,
          title: "Direct Embed",
          youtube: "https://www.youtube.com/embed/xyz123abcde",
          learn: null,
        },
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const iframe = wrapper.find('[data-testid="youtube-iframe"]');
    expect(iframe.attributes("src")).toBe("https://www.youtube.com/embed/xyz123abcde");

    // Non-standard URL fallback
    const { wrapper: wOther } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 997 },
      preloadedState: {
        profile: mockProfile,
        content: {
          id: 997,
          title: "Other video",
          youtube: "https://vimeo.com/12345",
          learn: null,
        },
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(wOther.find('[data-testid="youtube-iframe"]').attributes("src")).toBe("https://vimeo.com/12345");
  });

  it("should render placeholder when youtube link is empty", async () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 101, contentId: 998 },
      preloadedState: {
        profile: mockProfile,
        content: {
          id: 998,
          title: "Tanpa Video",
          youtube: "",
          learn: null,
        },
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Tautan video tidak tersedia");
  });

  it("should handle activeContentId change and reading from page params", async () => {
    const setContentSpy = vi.spyOn(coursesStore, "asyncSetContent").mockReturnValue(Promise.resolve());

    const { setProps } = renderWithProviders(ContentPage, {
      route: "/courses/101/contents/501",
      preloadedState: {
        profile: mockProfile,
        content: mockContentNotLearned,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    // Update prop
    setProps({ contentId: 505 });
    await new Promise((r) => setTimeout(r, 20));

    expect(setContentSpy).toHaveBeenCalledWith(505);
  });
});
