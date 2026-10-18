<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { LayoutDashboard, Users, CircleUser, ChevronRight } from "lucide-svelte";

  export let isSidebarOpen: boolean = false;
  export let onCloseMobile: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  const navItems = [
    {
      to: "/",
      label: "Semua Kursus",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/users",
      label: "Semua Pengguna",
      icon: Users,
      exact: false,
    },
    {
      to: "/profile",
      label: "Profil Saya",
      icon: CircleUser,
      exact: false,
    },
  ];

  function handleNav(to: string) {
    goto(to);
    dispatch("close-mobile");
    if (onCloseMobile) onCloseMobile();
  }

  function isItemActive(item: (typeof navItems)[0], currentPath: string): boolean {
    if (item.exact) {
      return currentPath === item.to;
    }
    return currentPath.startsWith(item.to);
  }
</script>

<div>
  <!-- Mobile Backdrop -->
  {#if isSidebarOpen}
    <div
      role="button"
      tabindex="0"
      data-testid="sidebar-backdrop"
      on:click={() => {
        dispatch("close-mobile");
        if (onCloseMobile) onCloseMobile();
      }}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") {
          dispatch("close-mobile");
          if (onCloseMobile) onCloseMobile();
        }
      }}
      class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
    ></div>
  {/if}

  <!-- Sidebar Container -->
  <aside
    data-testid="sidebar"
    class="fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-xs transition-transform duration-300 md:translate-x-0 flex flex-col justify-between {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
  >
    <div class="p-4 space-y-6">
      <div>
        <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Menu Utama
        </p>
        <nav class="space-y-1">
          {#each navItems as item (item.to)}
            {@const active = isItemActive(item, page.url.pathname)}
            <button
              type="button"
              data-testid={`sidebar-link-${item.to}`}
              on:click={() => handleNav(item.to)}
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all {active
                ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
            >
              <div class="flex items-center gap-3">
                <svelte:component
                  this={item.icon}
                  size={19}
                  class={active ? "text-indigo-600" : "text-slate-500"}
                />
                <span>{item.label}</span>
              </div>
              {#if active}
                <ChevronRight size={16} class="text-indigo-600" />
              {/if}
            </button>
          {/each}
        </nav>
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-slate-100 text-center">
      <p class="text-xs text-slate-600 font-medium">Delcom Courses &copy; 2026</p>
    </div>
  </aside>
</div>

