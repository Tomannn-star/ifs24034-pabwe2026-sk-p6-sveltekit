import { describe, it, expect, vi, beforeEach } from "vitest";
import SidebarComponent from "./SidebarComponent.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";

describe("SidebarComponent (Courses)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all menu items with active indicator on /", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: { isSidebarOpen: false },
    });

    expect(wrapper.text()).toContain("Semua Kursus");
    expect(wrapper.text()).toContain("Semua Pengguna");
    expect(wrapper.text()).toContain("Profil Saya");

    const homeBtn = wrapper.find('[data-testid="sidebar-link-/"]');
    expect(homeBtn.classes("bg-indigo-50")).toBe(true);
  });

  it("should highlight active item on /users", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/users",
      props: { isSidebarOpen: false },
    });

    const usersBtn = wrapper.find('[data-testid="sidebar-link-/users"]');
    expect(usersBtn.classes("bg-indigo-50")).toBe(true);
  });

  it("should navigate and trigger close on item click", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
        onCloseMobile: closeSpy,
      },
    });

    const profileBtn = wrapper.find('[data-testid="sidebar-link-/profile"]');
    await profileBtn.trigger("click");

    expect(mockGoto).toHaveBeenCalledWith("/profile");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should trigger close on mobile backdrop click", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
        onCloseMobile: closeSpy,
      },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    expect(backdrop.exists()).toBe(true);
    await backdrop.trigger("click");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle navigation and backdrop click when callback prop is omitted", async () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: { isSidebarOpen: true },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("click");
    await backdrop.trigger("keydown", { key: "Enter" });

    const usersBtn = wrapper.find('[data-testid="sidebar-link-/users"]');
    await usersBtn.trigger("click");

    expect(mockGoto).toHaveBeenCalledWith("/users");
  });

  it("should trigger close on mobile backdrop keydown Enter, Escape and ignore other keys", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
      props: {
        isSidebarOpen: true,
        onCloseMobile: closeSpy,
      },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("keydown", { key: "Enter" });
    expect(closeSpy).toHaveBeenCalledTimes(1);

    await backdrop.trigger("keydown", { key: "Escape" });
    expect(closeSpy).toHaveBeenCalledTimes(2);

    await backdrop.trigger("keydown", { key: "Tab" });
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });
});

