<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ImagePlus, X, LoaderCircle, Upload } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show: boolean = false;
  export let courseId: number | string = "";
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let file: File | null = null;
  let previewUrl: string | null = null;

  function handleClose() {
    previewUrl = null;
    file = null;
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

  $: if ($coursesStore.isCourseChangeCover) {
    loading = false;
    coursesStore.setIsCourseChangeCover(false);
    if ($coursesStore.isCourseChangedCover) {
      coursesStore.setIsCourseChangedCover(false);
      coursesStore.asyncSetCourse(courseId);
      coursesStore.asyncSetCourses();
      handleClose();
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showErrorDialog("Pilih file gambar (JPG/PNG)!");
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      showErrorDialog("Ukuran gambar maksimal 1MB!");
      return;
    }

    file = selectedFile;
    previewUrl = URL.createObjectURL(selectedFile);
  }

  function handleSave() {
    if (!file) {
      showErrorDialog("Silakan pilih cover baru!");
      return;
    }

    loading = true;
    coursesStore.asyncSetIsCourseChangeCover(courseId, file);
  }
</script>

{#if show && courseId}
  <div
    data-testid="change-cover-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <ImagePlus size={18} strokeWidth={2.5} />
          </div>
          <h3 class="text-base font-bold text-slate-800">Ubah Cover Kursus</h3>
        </div>
        <button
          type="button"
          data-testid="close-cover-modal-btn"
          on:click={handleClose}
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form on:submit|preventDefault={handleSave} class="p-6 space-y-4">
        <div>
          <span class="block text-sm font-semibold text-slate-700 mb-2">
            Pilih Gambar Cover
          </span>
          <label
            for="course-cover-input"
            class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors {previewUrl
              ? 'border-indigo-400 bg-indigo-50/20'
              : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/10'}"
          >
            {#if previewUrl}
              <img
                src={previewUrl}
                alt="Pratinjau Cover"
                class="w-full h-full object-cover rounded-xl"
              />
            {:else}
              <div class="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                <Upload size={24} class="mb-2 text-indigo-500" />
                <p class="text-xs font-semibold text-slate-700">
                  Klik untuk unggah atau seret gambar ke sini
                </p>
                <p class="text-[11px] text-slate-400 mt-1">PNG, JPG atau WEBP (Maks. 1MB)</p>
              </div>
            {/if}
            <input
              id="course-cover-input"
              data-testid="course-cover-input"
              type="file"
              accept="image/*"
              class="hidden"
              on:change={handleFileChange}
            />
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-cover-modal-btn"
            on:click={handleClose}
            disabled={loading}
            class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="submit-cover-modal-btn"
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
          >
            {#if loading}
              <LoaderCircle size={16} class="animate-spin" />
              <span>Mengunggah...</span>
            {:else}
              <ImagePlus size={16} strokeWidth={2.5} />
              <span>Unggah Cover</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

