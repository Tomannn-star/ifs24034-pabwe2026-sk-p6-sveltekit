<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ContentModal from "../modals/ContentModal.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { showConfirmDialog, showErrorDialog } from "../../../helpers/toolsHelper";
  import {
    ArrowLeft,
    ImagePlus,
    PenLine,
    Trash2,
    Plus,
    Video,
    GraduationCap,
    Users,
    Star,
    CheckCircle2,
    Circle,
    UserCheck,
    LogOut,
    MessageSquare,
  } from "lucide-svelte";

  export let courseId: number | string = "";

  $: activeCourseId = courseId || (page?.params?.courseId ?? "");

  $: profile = $usersStore.profile;
  $: course = $coursesStore.course;
  $: contents = course?.contents || [];
  $: students = course?.students || [];
  $: studentCount = students.length;

  $: isOwner = Boolean(profile && course && profile.id === course.user_id);
  $: isStudent = Boolean(!isOwner && profile && course && students.some((s: any) => s.id === profile?.id));

  let showCoverModal: boolean = false;
  let showEditModal: boolean = false;
  let showContentModal: boolean = false;
  let selectedContent: any = null;

  let ratingValue: number = 5;
  let ratingComment: string = "";

  onMount(() => {
    if (activeCourseId) {
      coursesStore.asyncSetCourse(activeCourseId);
    }
  });

  let prevId: number | string = activeCourseId;
  $: if (activeCourseId && activeCourseId !== prevId) {
    prevId = activeCourseId;
    coursesStore.asyncSetCourse(activeCourseId);
  }

  $: if ($coursesStore.isCourse) {
    coursesStore.setIsCourse(false);
    if (!course) {
      goto("/");
    }
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    goto("/");
  }

  $: if ($coursesStore.isStudentEnroll) {
    coursesStore.setIsStudentEnroll(false);
    if ($coursesStore.isStudentEnrolled) {
      coursesStore.setIsStudentEnrolled(false);
      coursesStore.asyncSetCourse(activeCourseId);
    }
  }

  $: if ($coursesStore.isStudentLeave) {
    coursesStore.setIsStudentLeave(false);
    if ($coursesStore.isStudentLeft) {
      coursesStore.setIsStudentLeft(false);
      coursesStore.asyncSetCourse(activeCourseId);
    }
  }

  $: if ($coursesStore.isRatingSubmit) {
    coursesStore.setIsRatingSubmit(false);
    if ($coursesStore.isRatingSubmitted) {
      coursesStore.setIsRatingSubmitted(false);
      ratingComment = "";
      coursesStore.asyncSetCourse(activeCourseId);
    }
  }

  $: if ($coursesStore.isContentDelete) {
    coursesStore.setIsContentDelete(false);
    if ($coursesStore.isContentDeleted) {
      coursesStore.setIsContentDeleted(false);
      coursesStore.asyncSetCourse(activeCourseId);
    }
  }

  async function handleDeleteCourse() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed && course) {
      coursesStore.asyncSetIsCourseDelete(course.id);
    }
  }

  async function handleEnroll() {
    coursesStore.asyncSetIsStudentEnroll(course.id);
  }

  async function handleLeave() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin keluar dari kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsStudentLeave(course.id);
    }
  }

  function handleAddContent() {
    selectedContent = null;
    showContentModal = true;
  }

  function handleEditContent(item: any) {
    selectedContent = item;
    showContentModal = true;
  }

  async function handleDeleteContent(contentId: number | string) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus materi ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsContentDelete(contentId);
    }
  }

  function handleRatingSubmit() {
    if (!ratingComment.trim()) {
      showErrorDialog("Komentar ulasan tidak boleh kosong!");
      return;
    }
    coursesStore.asyncSetIsRatingSubmit(course.id, ratingValue, ratingComment.trim());
  }

  function handleNavigate(to: string) {
    goto(to);
  }
</script>

{#if !profile || !course}
  <div class="flex flex-col items-center justify-center py-20" data-testid="loading-spinner">
    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    <h1 class="text-sm font-medium text-slate-600 mt-3">Memuat detail kursus...</h1>
  </div>
{:else}
  <div class="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
    <!-- Top Bar Navigation & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <a
        href="/"
        data-testid="back-to-courses-link"
        on:click|preventDefault={() => handleNavigate("/")}
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Kembali ke Semua Kursus
      </a>

      {#if isOwner}
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            data-testid="edit-cover-btn"
            on:click={() => (showCoverModal = true)}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors cursor-pointer"
          >
            <ImagePlus size={15} />
            Ubah Cover
          </button>
          <button
            type="button"
            data-testid="edit-course-btn"
            on:click={() => (showEditModal = true)}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors cursor-pointer"
          >
            <PenLine size={15} />
            Ubah Data
          </button>
          <button
            type="button"
            data-testid="delete-course-btn"
            on:click={handleDeleteCourse}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
            Hapus
          </button>
        </div>
      {/if}
    </div>

    <!-- Header Card with Cover -->
    <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="h-48 sm:h-64 w-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 relative flex items-center justify-center">
        {#if course.cover}
          <img src={course.cover} alt={course.title} class="w-full h-full object-cover" />
        {:else}
          <div class="text-white/40 flex flex-col items-center gap-2">
            <GraduationCap size={48} />
            <span class="text-xs font-semibold tracking-wider uppercase text-white/50">Belum ada cover</span>
          </div>
        {/if}

        {#if course.rating}
          <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-xs bg-amber-500 text-white flex items-center gap-1">
            <Star size={13} class="fill-current" />
            <span>{course.rating}</span>
          </div>
        {/if}
      </div>

      <div class="p-6 sm:p-8 space-y-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" data-testid="course-title">
            {course.title}
          </h1>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed" data-testid="course-description">
            {course.description || "Tidak ada deskripsi."}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            {#if course.author?.photo}
              <img src={course.author.photo} alt={course.author.name} class="w-6 h-6 rounded-full object-cover" />
            {:else}
              <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                {course.author?.name ? course.author.name.charAt(0) : "U"}
              </div>
            {/if}
            <span>Instruktur: <strong class="text-slate-700">{course.author?.name || "Pengguna"}</strong></span>
          </div>
          <div class="flex items-center gap-4">
            <span><strong class="font-normal text-slate-500">{students.length}</strong> Peserta Terdaftar</span>
            <span><strong class="font-normal text-slate-500">{contents.length}</strong> Materi Tersedia</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollment Status & Actions for Non-Owner -->
    {#if isOwner}
      <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 text-indigo-700 text-sm font-medium">
        <UserCheck size={20} class="text-indigo-600 shrink-0" />
        <span>Anda adalah <strong>pemilik</strong> kursus ini. Anda dapat mengelola materi dan detail kursus.</span>
      </div>
    {:else if isStudent}
      <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <CheckCircle2 size={22} class="text-emerald-600 shrink-0" />
          <div>
            <p class="text-sm font-bold text-emerald-900">Anda Terdaftar Sebagai Peserta</p>
            <p class="text-xs text-emerald-700">Pelajari semua materi video dan berikan ulasan Anda di bawah.</p>
          </div>
        </div>
        <button
          type="button"
          data-testid="leave-course-btn"
          on:click={handleLeave}
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
        >
          <LogOut size={15} />
          <span>Keluar Kursus</span>
        </button>
      </div>

      <!-- Rating Submission Section for Enrolled Student -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
        <div class="flex items-center gap-2 text-slate-800">
          <MessageSquare size={18} class="text-indigo-600" />
          <h2 class="text-base font-bold">Beri Penilaian &amp; Ulasan Kursus</h2>
        </div>

        <div class="space-y-3">
          <div>
            <label for="rating-select" class="block text-xs font-semibold text-slate-700 mb-1">
              Nilai Bintang (1 - 5)
            </label>
            <select
              id="rating-select"
              data-testid="rating-select"
              bind:value={ratingValue}
              class="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value={5}>5 Bintang (Sangat Baik)</option>
              <option value={4}>4 Bintang (Baik)</option>
              <option value={3}>3 Bintang (Cukup)</option>
              <option value={2}>2 Bintang (Kurang)</option>
              <option value={1}>1 Bintang (Buruk)</option>
            </select>
          </div>

          <div>
            <label for="rating-comment-input" class="block text-xs font-semibold text-slate-700 mb-1">
              Komentar Ulasan
            </label>
            <textarea
              id="rating-comment-input"
              data-testid="rating-comment-input"
              bind:value={ratingComment}
              rows="2"
              placeholder="Bagikan pengalaman belajar Anda pada kursus ini..."
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

          <button
            type="button"
            data-testid="submit-rating-btn"
            on:click={handleRatingSubmit}
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Star size={14} class="fill-current" />
            <span>Kirim Penilaian</span>
          </button>
        </div>
      </div>
    {:else}
      <div class="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-base font-bold text-slate-800">Tertarik Mengikuti Kursus Ini?</h2>
          <p class="text-xs text-slate-700 mt-1">Daftar sekarang untuk dapat mengakses seluruh materi dan menandai progress belajar.</p>
        </div>
        <button
          type="button"
          data-testid="enroll-course-btn"
          on:click={handleEnroll}
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all shrink-0 cursor-pointer"
        >
          <GraduationCap size={18} />
          <span>Daftar Kursus</span>
        </button>
      </div>
    {/if}

    <!-- Contents Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Materi Pembelajaran Video</h2>
          <p class="text-xs text-slate-600">Tonton dan pelajari video materi yang telah disediakan.</p>
        </div>

        {#if isOwner}
          <button
            type="button"
            data-testid="add-content-btn"
            on:click={handleAddContent}
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Tambah Materi</span>
          </button>
        {/if}
      </div>

      {#if contents.length === 0}
        <div class="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <div class="w-12 h-12 mx-auto rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2">
            <Video size={24} />
          </div>
          <p class="text-sm font-semibold text-slate-700">Belum ada materi pembelajaran</p>
          <p class="text-xs text-slate-600 mt-1">
            {#if isOwner}
              Klik tombol "Tambah Materi" untuk menambahkan video pertama Anda.
            {:else}
              Instruktur belum menambahkan materi untuk kursus ini.
            {/if}
          </p>
        </div>
      {:else}
        <div class="space-y-3" data-testid="contents-list">
          {#each contents as item, index (item.id)}
            <div
              class="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Video size={18} />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-600">#{index + 1}</span>
                    <h3 class="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  </div>
                  <p class="text-xs text-slate-600 truncate max-w-sm sm:max-w-md">{item.youtube}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {#if item.learn && item.learn.status === 1}
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    <CheckCircle2 size={12} />
                    Selesai
                  </span>
                {:else if isStudent}
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    <Circle size={10} />
                    Belum
                  </span>
                {/if}

                {#if isOwner}
                  <button
                    type="button"
                    data-testid={`edit-content-btn-${item.id}`}
                    on:click={() => handleEditContent(item)}
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Ubah Materi"
                  >
                    <PenLine size={15} />
                  </button>
                  <button
                    type="button"
                    data-testid={`delete-content-btn-${item.id}`}
                    on:click={() => handleDeleteContent(item.id)}
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Materi"
                  >
                    <Trash2 size={15} />
                  </button>
                {/if}

                <a
                  href={`/courses/${activeCourseId}/contents/${item.id}`}
                  data-testid={`content-link-${item.id}`}
                  on:click|preventDefault={() => handleNavigate(`/courses/${activeCourseId}/contents/${item.id}`)}
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <span>Buka Video</span>
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Students List Section -->
    <div class="space-y-4 pt-4 border-t border-slate-100">
      <div class="flex items-center gap-2 text-slate-800">
        <Users size={18} class="text-indigo-600" />
        <h2 class="text-lg font-bold">Daftar Peserta Kursus (<span>{studentCount}</span>)</h2>
      </div>

      {#if students.length === 0}
        <p class="text-xs text-slate-600 italic">Belum ada peserta yang mendaftar di kursus ini.</p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {#each students as student (student.id)}
            <div class="p-3 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center gap-2.5">
              {#if student.photo}
                <img src={student.photo} alt={student.name} class="w-8 h-8 rounded-full object-cover shrink-0" />
              {:else}
                <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {student.name ? student.name.charAt(0) : "P"}
                </div>
              {/if}
              <div class="overflow-hidden">
                <p class="text-xs font-bold text-slate-800 truncate">{student.name}</p>
                <p class="text-[11px] text-slate-600 truncate">{student.email || "Peserta"}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <ChangeCoverModal
    show={showCoverModal}
    courseId={activeCourseId}
    on:close={() => (showCoverModal = false)}
    onClose={() => (showCoverModal = false)}
  />

  <ChangeModal
    show={showEditModal}
    courseId={activeCourseId}
    on:close={() => (showEditModal = false)}
    onClose={() => (showEditModal = false)}
  />

  <ContentModal
    show={showContentModal}
    courseId={activeCourseId}
    content={selectedContent}
    on:close={() => (showContentModal = false)}
    onClose={() => (showContentModal = false)}
  />
{/if}

