<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Video,
    Calendar,
    ExternalLink,
  } from "lucide-svelte";

  export let courseId: number | string = "";
  export let contentId: number | string = "";

  $: activeCourseId = courseId || (page?.params?.courseId ?? "");
  $: activeContentId = contentId || (page?.params?.contentId ?? "");

  $: profile = $usersStore.profile;
  $: content = $coursesStore.content;

  onMount(() => {
    if (activeContentId) {
      coursesStore.asyncSetContent(activeContentId);
    }
  });

  let prevId: number | string = activeContentId;
  $: if (activeContentId && activeContentId !== prevId) {
    prevId = activeContentId;
    coursesStore.asyncSetContent(activeContentId);
  }

  $: if ($coursesStore.isContent) {
    coursesStore.setIsContent(false);
    if (!content) {
      goto(`/courses/${activeCourseId}`);
    }
  }

  $: if ($coursesStore.isLearnStatusChange) {
    coursesStore.setIsLearnStatusChange(false);
    if ($coursesStore.isLearnStatusChanged) {
      coursesStore.setIsLearnStatusChanged(false);
      coursesStore.asyncSetContent(activeContentId);
    }
  }

  function getYoutubeEmbedUrl(url: string): string {
    if (url.includes("/embed/")) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|(?:embed|v)\/))([a-zA-Z0-9_-]{11})/);
    return (match && match[1]) ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  $: youtubeLink = content?.youtube || "";
  $: embedUrl = youtubeLink ? getYoutubeEmbedUrl(youtubeLink) : "";
  $: isLearned = Boolean(content?.learn && content.learn.status === 1);

  function handleToggleLearn() {
    const nextStatus = isLearned ? 0 : 1;
    coursesStore.asyncSetIsLearnStatusChange(content.id, nextStatus);
  }

  function handleBack() {
    goto(`/courses/${activeCourseId}`);
  }
</script>

{#if !profile || !content}
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else}
  <div class="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
    <!-- Top Navigation -->
    <div class="flex items-center justify-between">
      <a
        href={`/courses/${activeCourseId}`}
        data-testid="back-to-detail-link"
        on:click|preventDefault={handleBack}
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Kembali ke Detail Kursus
      </a>

      <!-- Mark as Completed Button -->
      <button
        type="button"
        data-testid="toggle-learn-btn"
        on:click={handleToggleLearn}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer {isLearned
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'}"
      >
        {#if isLearned}
          <CheckCircle2 size={16} class="text-emerald-600" />
          <span>Selesai Dipelajari (Klik untuk Batal)</span>
        {:else}
          <Circle size={16} />
          <span>Tandai Selesai Dipelajari</span>
        {/if}
      </button>
    </div>

    <!-- Video Player Container -->
    <div class="bg-black rounded-3xl overflow-hidden shadow-xl aspect-video border border-slate-800 flex items-center justify-center">
      {#if embedUrl}
        <iframe
          src={embedUrl}
          title={content.title}
          data-testid="youtube-iframe"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      {:else}
        <div class="text-white/40 flex flex-col items-center gap-2">
          <Video size={48} />
          <p class="text-xs text-white/50">Tautan video tidak tersedia</p>
        </div>
      {/if}
    </div>

    <!-- Content Meta & Details -->
    <div class="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" data-testid="content-title">
          {content.title}
        </h1>
        {#if isLearned}
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            <CheckCircle2 size={14} />
            Materi ini telah Anda selesaikan
          </span>
        {/if}
      </div>

      {#if youtubeLink}
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span class="truncate max-w-sm sm:max-w-md">Sumber: <span>{youtubeLink}</span></span>
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="youtube-external-link"
            class="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            <span>Tonton di YouTube</span>
            <ExternalLink size={13} />
          </a>
        </div>
      {/if}
    </div>
  </div>
{/if}

