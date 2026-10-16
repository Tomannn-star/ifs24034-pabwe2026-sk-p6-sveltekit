<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { PenLine, X, LoaderCircle } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import courseApi from "../api/courseApi";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show: boolean = false;
  export let courseId: number | string = "";
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let fetching: boolean = false;
  let title: string = "";
  let description: string = "";

  function handleClose() {
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if (show && courseId) {
    loadData(courseId);
  }

  async function loadData(id: number | string) {
    fetching = true;
    try {
      const course = await courseApi.getCourseById(id);
      if (course) {
        title = course.title || "";
        description = course.description || "";
      }
    } catch {
      showErrorDialog("Gagal mengambil data kursus");
      handleClose();
    } finally {
      fetching = false;
    }
  }

  $: if ($coursesStore.isCourseChange) {
    loading = false;
    coursesStore.setIsCourseChange(false);
    if ($coursesStore.isCourseChanged) {
      coursesStore.setIsCourseChanged(false);
      coursesStore.asyncSetCourses();
      coursesStore.asyncSetCourse(courseId);
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul kursus tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      showErrorDialog("Deskripsi kursus tidak boleh kosong");
      return;
    }

    loading = true;
    coursesStore.asyncSetIsCourseChange(
      courseId,
      title.trim(),
      description.trim()
    );
  }
</script>

{#if show}
  <div
    data-testid="edit-course-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"
          >
            <PenLine size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">Ubah Data Kursus</h3>
            <p class="text-xs text-slate-500">
              Perbarui judul dan deskripsi kursus ini
            </p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-change-modal-btn"
          on:click={handleClose}
          class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Modal Form Body -->
      {#if fetching}
        <div class="p-12 flex flex-col items-center justify-center gap-3">
          <LoaderCircle size={28} class="animate-spin text-indigo-600" />
          <p class="text-sm text-slate-500">Memuat data kursus...</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSave} class="p-6 space-y-4">
          <div>
            <label
              for="change-course-title-input"
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Judul Kursus <span class="text-red-500">*</span>
            </label>
            <input
              id="change-course-title-input"
              type="text"
              data-testid="change-course-title-input"
              bind:value={title}
              placeholder="Judul kursus..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm shadow-xs"
              required
            />
          </div>

          <div>
            <label
              for="change-course-description-input"
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Deskripsi <span class="text-red-500">*</span>
            </label>
            <textarea
              id="change-course-description-input"
              data-testid="change-course-description-input"
              bind:value={description}
              rows="3"
              placeholder="Deskripsi kursus..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm shadow-xs"
              required
            ></textarea>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0"
          >
            <button
              type="button"
              data-testid="cancel-change-modal-btn"
              on:click={handleClose}
              disabled={loading}
              class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="submit-change-modal-btn"
              disabled={loading}
              class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
            >
              {#if loading}
                <LoaderCircle size={18} class="animate-spin" />
                <span>Menyimpan...</span>
              {:else}
                <PenLine size={18} strokeWidth={2.5} />
                <span>Simpan Perubahan</span>
              {/if}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}

