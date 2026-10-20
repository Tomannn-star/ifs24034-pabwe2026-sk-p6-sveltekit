<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AddModal from "../modals/AddModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    Plus,
    BookOpen,
    Eye,
    Pencil,
    Trash2,
    Search,
    GraduationCap,
    Users,
    Star,
    LoaderCircle,
  } from "lucide-svelte";

  let loading: boolean = false;
  let isMeFilter: string = "";
  let searchQuery: string = "";
  let showAddModal: boolean = false;
  let showChangeModal: boolean = false;
  let selectedCourseId: number | string = "";

  $: profile = $usersStore.profile;
  $: courses = $coursesStore.courses || [];

  onMount(() => {
    loadCourses();
  });

  function loadCourses() {
    loading = true;
    Promise.resolve(coursesStore.asyncSetCourses(isMeFilter, searchQuery)).finally(() => {
      loading = false;
    });
  }

  let prevFilter: string = isMeFilter;
  $: if (isMeFilter !== prevFilter) {
    prevFilter = isMeFilter;
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeletedAll) {
    coursesStore.setIsCourseDeletedAll(false);
    loadCourses();
  }

  function handleEdit(id: number | string) {
    selectedCourseId = id;
    showChangeModal = true;
  }

  async function handleDelete(id: number | string) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(id);
    }
  }

  async function handleDeleteAll() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus SEMUA kursus milik Anda?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDeleteAll();
    }
  }

  function handleNavigate(to: string) {
    goto(to);
  }

  $: filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = course.title ? course.title.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  $: totalCount = courses.length;
  $: myCount = profile ? courses.filter((c) => c.user_id === profile?.id).length : 0;
  $: enrolledCount = profile
    ? courses.filter((c) => c.students?.some((s: any) => s.id === profile?.id)).length
    : 0;
</script>

{#if profile}
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daftar Kursus
        </h1>
        <p class="text-sm text-slate-600 mt-1">
          Kelola dan jelajahi kumpulan kursus dan materi pembelajaran.
        </p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        {#if courses.some((c) => c.user_id === profile?.id)}
          <button
            type="button"
            data-testid="delete-all-btn"
            on:click={handleDeleteAll}
            class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Hapus Semua</span>
          </button>
        {/if}
        <button
          type="button"
          data-testid="add-course-btn"
          on:click={() => (showAddModal = true)}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Kursus</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-600">Total Kursus</p>
          <p class="text-2xl font-black text-slate-800 mt-1" data-testid="total-count">{totalCount}</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <BookOpen size={22} />
        </div>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-600">Kursus Saya</p>
          <p class="text-2xl font-black text-emerald-600 mt-1" data-testid="my-count">{myCount}</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <GraduationCap size={22} />
        </div>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-600">Kursus Diikuti</p>
          <p class="text-2xl font-black text-amber-600 mt-1" data-testid="enrolled-count">{enrolledCount}</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Users size={22} />
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          data-testid="search-input"
          bind:value={searchQuery}
          placeholder="Cari judul atau deskripsi..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          data-testid="filter-all-btn"
          on:click={() => (isMeFilter = "")}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer {isMeFilter === '' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}"
        >
          Semua Kursus
        </button>
        <button
          type="button"
          data-testid="filter-my-btn"
          on:click={() => (isMeFilter = "1")}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer {isMeFilter === '1' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}"
        >
          Milik Saya
        </button>
      </div>
    </div>

    <!-- Course Grid -->
    {#if loading}
      <div class="py-20 flex flex-col items-center justify-center gap-3">
        <LoaderCircle size={32} class="animate-spin text-indigo-600" />
        <p class="text-sm font-medium text-slate-500">Memuat kursus...</p>
      </div>
    {:else if filteredCourses.length === 0}
      <div class="py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-xs p-8">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
          <BookOpen size={28} />
        </div>
        <h2 class="text-base font-bold text-slate-800">Belum ada Kursus</h2>
        <p class="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
          Tidak ada kursus yang cocok dengan kriteria pencarian Anda.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="course-grid">
        {#each filteredCourses as course (course.id)}
          <div class="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
            <!-- Cover image or fallback banner -->
            <div class="h-40 w-full bg-gradient-to-tr from-slate-800 via-indigo-950 to-indigo-900 relative overflow-hidden flex items-center justify-center">
              {#if course.cover}
                <img
                  src={course.cover.replace("https://open-api.delcom.org", "")}
                  alt={course.title}
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              {:else}
                <div class="text-white/40 flex flex-col items-center">
                  <GraduationCap size={42} />
                </div>
              {/if}
              <!-- Rating badge if available -->
              {#if course.rating}
                <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs bg-amber-500 text-white flex items-center gap-1">
                  <Star size={12} class="fill-current" />
                  <span>{course.rating}</span>
                </div>
              {/if}
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 class="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h2>
                <p class="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  {course.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 overflow-hidden">
                  {#if course.author?.photo}
                    <img src={course.author.photo.replace("https://open-api.delcom.org", "")} alt={course.author.name} class="w-6 h-6 rounded-full object-cover shrink-0" loading="lazy" decoding="async" />
                  {:else}
                    <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0">
                      {course.author?.name ? course.author.name.charAt(0) : "U"}
                    </div>
                  {/if}
                  <span class="text-xs text-slate-600 font-medium truncate">{course.author?.name || "Instruktur"}</span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  {#if course.user_id === profile.id}
                    <button
                      type="button"
                      data-testid={`edit-btn-${course.id}`}
                      on:click={() => handleEdit(course.id)}
                      class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Ubah"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      data-testid={`delete-btn-${course.id}`}
                      on:click={() => handleDelete(course.id)}
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  {/if}
                  <a
                    href={`/courses/${course.id}`}
                    data-testid={`detail-link-${course.id}`}
                    on:click|preventDefault={() => handleNavigate(`/courses/${course.id}`)}
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Detail</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <AddModal
    show={showAddModal}
    on:close={() => (showAddModal = false)}
    onClose={() => (showAddModal = false)}
  />

  <ChangeModal
    show={showChangeModal}
    courseId={selectedCourseId}
    on:close={() => (showChangeModal = false)}
    onClose={() => (showChangeModal = false)}
  />
{:else}
  <div class="py-20 flex flex-col items-center justify-center gap-3">
    <LoaderCircle size={32} class="animate-spin text-indigo-600" />
    <h1 class="text-sm font-medium text-slate-600">Memuat daftar kursus...</h1>
  </div>
{/if}

