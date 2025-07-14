<script setup lang="ts">
const filters = reactive({ theme: "tous", duration: "tous", type: "tous" });
const { sessions, isLoading: loading, search } = useYouTubeSearch();

const error = ref("");
const lastSearch = ref("");
const fromCache = ref(false);

const audioResults = ref([]);
const videoResults = ref([]);

onMounted(loadDefaultContent);

function updateFilters(next) {
  Object.assign(filters, next);
  if (lastSearch.value) setTimeout(fetchVideos, 300);
}

function buildKeyword(type = null) {
  const t = type || filters.type;
  const base = filters.theme !== "tous" ? filters.theme : "";
  if (t === "audio")
    return `${base} relaxing music ambient calm sleep focus meditation music`.trim();
  if (t === "video")
    return `${base} guided meditation relaxation hypnosis mindfulness yoga zen breathing`.trim();
  return base || "relaxation meditation nature";
}

const CACHE_KEY = "ytCacheZenTime";
const readCache = (q) => {
  const all = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  const e = all[q];
  if (!e) return null;
  if (Date.now() - e.time > 6 * 60 * 60 * 1000) {
    delete all[q];
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
    return null;
  }
  return e.data;
};
const writeCache = (q, data) => {
  const all = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  all[q] = { time: Date.now(), data };
  localStorage.setItem(CACHE_KEY, JSON.stringify(all));
};

function applyDurationFilter(arr) {
  if (filters.duration === "tous") return arr;
  return arr.filter((v) => {
    const d = v.duration || 0;
    if (!d) return true;
    if (filters.duration === "court") return d < 300;
    if (filters.duration === "moyen") return d >= 300 && d <= 1200;
    if (filters.duration === "long") return d > 1200;
    return true;
  });
}

async function fetchAudioVideos() {
  const q = buildKeyword("audio");
  const c = readCache(`audio_${q}_${filters.duration}`);
  if (c) {
    audioResults.value = c;
    fromCache.value = true;
    return;
  }
  await search(q, "", "audio");
  const res = applyDurationFilter(sessions.value);
  audioResults.value = res;
  writeCache(`audio_${q}_${filters.duration}`, res);
}

async function fetchVideoContent() {
  const q = buildKeyword("video");
  const c = readCache(`video_${q}_${filters.duration}`);
  if (c) {
    videoResults.value = c;
    fromCache.value = true;
    return;
  }
  await search(q, "", "video");
  const res = applyDurationFilter(sessions.value);
  videoResults.value = res;
  writeCache(`video_${q}_${filters.duration}`, res);
}

async function fetchVideos() {
  error.value = "";
  fromCache.value = false;
  lastSearch.value = buildKeyword();
  try {
    if (filters.type === "audio") {
      await fetchAudioVideos();
      videoResults.value = [];
    } else if (filters.type === "video") {
      await fetchVideoContent();
      audioResults.value = [];
    } else {
      await Promise.all([fetchAudioVideos(), fetchVideoContent()]);
    }
  } catch (e) {
    console.error(e);
    error.value = "Erreur de chargement.";
  }
}

async function loadDefaultContent() {
  try {
    await fetchAudioVideos();
    await fetchVideoContent();
    lastSearch.value = "Contenu par défaut";
  } catch (e) {
    console.error(e);
  }
}

const audioVideos = computed(() =>
  filters.type === "video" ? [] : audioResults.value,
);
const guidedVideos = computed(() =>
  filters.type === "audio" ? [] : videoResults.value,
);
</script>

<template>
  <div
    class="hero bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 min-h-screen relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"
      />
      <div
        class="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"
      />
      <div
        class="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"
      />
    </div>
    <main
      class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20"
    >
      <section class="relative z-10 max-w-6xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <UFilterBar
            :model-value="filters"
            @update:model-value="updateFilters"
          />
          <button
            class="btn bg-base-200 text-base-content border-none hover:bg-base-300 transition"
            :disabled="loading"
            @click="fetchVideos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" version="1.0" viewBox="0 0 512 512" class="inline-block mr-2">
              <path d="M166.9 22c-27.5 2.6-55.7 13-77.9 28.8-12.2 8.6-29.6 26-38.2 38.2-25.6 36.2-35 81.7-25.8 125.7C36.4 269.1 77.6 315.3 130.7 333c18.8 6.2 26.7 7.4 50.3 7.4 23.7 0 32.4-1.2 51.2-7.5 17.1-5.7 37.1-16.7 49.7-27.3l4.4-3.7 11.8 11.7 11.9 11.8-8.5 8.6c-8.5 8.8-10.2 11.9-9 16.8.7 3 111.3 114.5 119.8 120.9 17 12.6 40.9 10.4 55.6-5.2 14.5-15.3 16-37.7 3.8-54.2-6.4-8.5-117.9-119.1-120.9-119.8-4.9-1.2-8 .5-16.8 9l-8.6 8.5-11.8-11.9-11.7-11.8 4.4-5.4c15.4-19.1 26.3-42.3 31.9-68.2 1.9-8.8 2.2-13.1 2.2-31.7 0-18.4-.3-22.9-2.2-31.3C325.3 91.7 285.3 47 230 29c-18-5.9-44.3-8.8-63.1-7m42.6 23.5c55 12.3 95.6 53.2 107.7 108.3 3.2 14.5 3.2 40.7 0 55.1-6.4 28.5-18.2 50.2-38.1 70.2-20 19.9-41.7 31.7-70.2 38.1-14.3 3.2-40.6 3.2-54.9.1-28.8-6.4-51.8-19.1-71.9-39.8C63.7 258.6 52 237.1 45.9 211c-2.6-11-3.6-36.4-2-48.1C52.4 102.8 98.6 55 158.3 44.5c10.7-1.9 41.2-1.3 51.2 1m192.2 325.7c29.2 29.3 53.8 54.6 54.6 56.3 5.1 10.6 1 23.2-9.4 28.5-5.1 2.7-13.9 2.7-19.3 0-2.7-1.3-22.2-20.1-57.1-55l-53-53 15-15c8.2-8.2 15.2-15 15.5-15s24.4 24 53.7 53.2"/>
              <path d="M168.5 64.6c-26.7 4.1-45.5 12.5-64.9 28.9-8 6.8-9.8 11.1-7.2 16.7 1.6 3.3 3.5 4.8 7.9 6.2 2.7.9 6.7-1.1 12.7-6.3 18.6-16.2 40-24.3 64-24.4 24.9-.1 45.4 7.7 64.8 24.6 6.9 6 10.1 7.2 14.8 5.2 4.2-1.7 6.4-5.1 6.4-9.7 0-4.8-4.9-10.4-16-18.7-13.5-10-29-17-46.2-20.7-7.2-1.5-30.5-2.7-36.3-1.8"/>
            </svg>
            Rechercher
          </button>
        </div>
      </section>
      <section
        v-if="filters.type === 'audio' || filters.type === 'tous'"
        class="relative z-10 max-w-6xl mx-auto px-4 mt-10"
      >
        <h2 class="text-2xl font-bold mb-4">
          Musique relaxante
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.0" viewBox="0 0 512 512" class="inline-block mr-2">
            <path d="m148.5 30.5-2.5 2.4v138.2c0 131.1-.1 138.1-1.7 137.4-15.1-6.1-14.2-5.9-28.8-5.9-11.6-.1-15.4.3-22.5 2.2-9.4 2.6-23.5 8.9-32.3 14.5-13.4 8.6-28.2 25.9-32.4 38-2.6 7.7-2.5 20.7.4 27 4.9 10.5 16.9 19.6 30.3 22.8 7.3 1.7 23.8 1.5 32.6-.4 30.9-6.9 60.1-29.7 68.2-53.2 1.6-4.6 1.7-15.9 2.2-139.5l.5-134.5 2.5 4c3.8 6.2 11.3 15.8 23 29.5 14.4 16.9 18.3 22.3 22.1 30.4 3.8 8.2 5 19.2 2.9 28.5-2.3 10.5-10.6 25.9-21.6 40.3-3.3 4.2-4.4 6.5-4.4 9.2 0 4.5 3.1 7.6 7.8 7.6 4.1 0 6.1-2 15.3-14.9 21-29.7 26.4-52.3 17.6-74-3.6-8.8-10.2-18.2-26.2-36.7-23.4-27.1-32.6-42.3-37.9-62.4-1.7-6.3-3.3-10.1-4.7-11.3-3.1-2.5-7.5-2.2-10.4.8m-17.1 290.1c2.7.9 6.5 3.3 8.6 5.4 10.2 10.2 6 27.2-10.7 43-8.9 8.5-19.4 14.8-32.1 19.1-9 3.1-10.6 3.3-22.7 3.4-11.6 0-13.6-.3-18.2-2.4-9.6-4.3-15.3-13.3-13.7-21.9 2.5-14 19.4-31.8 38.6-40.6 7.7-3.6 15.9-6.2 23.6-7.6 6.7-1.3 20.9-.4 26.6 1.6M374.3 55.3c-81.8 22-101.7 27.6-103.5 29.5l-2.3 2.3-.3 148.9-.2 149-3.8-1.9c-11.7-6-30-7.3-46.3-3.3-37.8 9.2-68.9 39.3-68.9 66.8 0 15.6 9.9 28 27.6 34.6 5.1 1.9 8 2.2 20.4 2.2 12.9 0 15.5-.3 23.4-2.8 30-9.1 54.4-29.5 61.9-51.5l2.2-6.6.3-125.1.3-125.1 17.2-4.6c95-25.5 166.7-44.7 167.2-44.7.3 0 .5 45.9.5 102s-.4 102-.8 102c-.5 0-2.7-.9-5-2-16.4-7.9-42.8-6.2-65.7 4.4-14.8 6.8-30.5 19.5-38.4 30.9-1.8 2.6-4.7 7.8-6.4 11.5-2.9 6.1-3.2 7.5-3.2 16.7 0 9 .3 10.5 2.8 15.4 5.5 10.3 16.2 18 29.7 21.2 19 4.5 47.3-2 68.1-15.6 10.6-6.9 23.5-20.4 28.2-29.3 7-13.3 6.7-3.1 6.7-183 0-121.5-.3-162.9-1.2-164.5-1.6-3.1-3.9-4.6-6.8-4.6-1.4 0-48.1 12.3-103.7 27.2M470 76.5v29.4l-3.7 1c-2.1.5-38.4 10.3-80.8 21.6C282 156.2 286.4 155 285.7 155c-.4 0-.7-13.2-.7-29.4V96.2l6.3-1.7C363.7 75 467.8 47.2 468.8 47.1c.9-.1 1.2 6.4 1.2 29.4m-16 261.6c20.2 7.1 20.2 28.4.1 47.9-16.5 16-38 24.6-59.2 23.8-8.4-.3-10.4-.8-16.3-3.7-9.2-4.5-12.1-8.9-12.1-18 .1-5.1.7-7.8 2.7-11.6 12-23.1 45-41.4 72.3-40.1 5 .3 10.6 1 12.5 1.7m-202.3 57.4c10.7 3.2 16.3 9.8 16.3 19.2 0 19.8-25.1 43.3-54.5 50.9-9.4 2.4-25.2 2.5-32.1.1-10.7-3.7-17.2-12.7-16.2-22.2 2.2-19.2 31.1-43 58.9-48.4 7.3-1.5 22.1-1.2 27.6.4"/>
          </svg>
        </h2>

        <div v-if="loading" class="text-center py-16">Chargement…</div>
        <div v-else-if="error" class="text-center py-16 text-error">
          {{ error }}
        </div>

        <div
          v-else-if="audioVideos.length"
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <SessionCard v-for="v in audioVideos" :key="v.id" :video="v" />
        </div>

        <div v-else class="text-center py-16 text-neutral">
          {{
            lastSearch
              ? "Aucune musique trouvée."
              : "Cliquez sur « Rechercher »."
          }}
        </div>
      </section>
      <section
        v-if="filters.type === 'video' || filters.type === 'tous'"
        class="relative z-10 max-w-6xl mx-auto px-4 mt-12"
      >
        <h2 class="text-2xl font-bold mb-4">
          Vidéos YouTube
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.0" viewBox="0 0 512 512" class="inline-block mr-2">
            <path d="M242.4 1.5c-11 2.4-19.2 7.9-24.1 16.3-3.3 5.5-4.3 17.3-2.1 23.7l1.4 4-4.9 5.4c-2.6 3-5.9 7.6-7.3 10.2-4.9 9.8-5.4 14-5.4 46.9 0 33.8.5 37.5 6.2 48.2 3.5 6.5 13.6 16.6 19.8 19.8 3.2 1.6 4 2.6 4 4.8 0 3.7-3.3 14.8-5.9 19.9-3.4 6.8-4.7 7.3-20.1 7.3-16.2 0-24.8 1.7-34.9 6.6-9.3 4.6-20.3 15.2-24.9 24.1-1.8 3.4-7.5 18-12.8 32.4-8.4 23.2-9.5 26.9-8.9 30.7.8 5.4 5.1 10.4 11 12.9 2.5 1 4.5 2 4.5 2.3-.1 1-7.8 27.1-8.2 27.4-.1.2-13.1-.7-28.8-2-31.8-2.6-43.8-2.9-52.6-1.3-8.3 1.4-17.7 4.6-25.8 8.6-19.7 9.9-24.9 17.5-19.7 28.9 3.1 6.9 6.5 8.2 25.3 10 9 .8 17.3 1.7 18.6 2l2.3.5-2.6 3.4c-6.1 7.8-8.9 22.3-6.5 32.6 2.9 12.4 12.5 24.6 23.2 29.4 2.9 1.3 34.9 10.7 71 21 65.2 18.6 65.7 18.8 66.7 21.7 1.7 4.9 5.2 9 9.5 10.9 3.6 1.6 6.8 1.9 25.6 1.9 13.7 0 24.6-.5 30.1-1.4 4.7-.8 21.8-5.3 38-10.1 105.7-31.3 140.3-41.6 143.5-43 14.7-6.1 25.4-22.6 25.4-39 0-7.8-3-17.8-7-23.3-3.6-5-5.1-4.5 17.8-6.6 18.8-1.8 22.2-3.1 25.3-10 2.4-5.3 2.4-9-.1-14.2-4.1-8.4-26.7-20-45.4-23.3-8.8-1.6-20.8-1.3-52.6 1.3-15.7 1.3-28.7 2.2-28.8 2-.4-.3-8.1-26.4-8.2-27.4 0-.3 2-1.3 4.5-2.3 5.9-2.5 10.2-7.5 11-12.9.6-3.8-.5-7.5-8.9-30.7-5.3-14.4-11-29-12.8-32.4-4.6-8.9-15.6-19.5-24.9-24.1-10.1-4.9-18.7-6.6-34.9-6.6-15.6 0-16.7-.4-20.4-7.9-2.7-5.2-5.6-15.4-5.6-19.5 0-2 .9-3 4-4.6 6.2-3.2 16.3-13.3 19.8-19.8 5.7-10.7 6.2-14.4 6.2-48.2 0-32.9-.5-37.1-5.4-46.9-1.4-2.6-4.7-7.2-7.3-10.2l-4.9-5.4 1.4-4c2.2-6.4 1.2-18.2-2.1-23.7-3.1-5.3-8.1-9.9-13.8-12.9-9.1-4.6-25.3-6.1-37.5-3.4m30.1 18c6.4 3.1 8.5 6.3 8.5 13.1 0 4-.2 4.5-1.7 3.9-5.6-2.2-17.5-4.5-23.3-4.5s-17.7 2.3-23.2 4.5c-1.6.6-1.8.1-1.8-3.8 0-2.6.5-5.8 1.2-7.2 4.1-9 27.2-12.4 40.3-6m-6.6 29.6c7.1 1.6 14.7 5.7 19.6 10.5 4.5 4.3 10 14.3 9.3 16.5-.2.7-3-1.8-6.3-5.5-6.8-7.8-9.8-9.6-15.8-9.6-3.5 0-5.8.9-10.8 4.2-11.3 7.3-24.4 12-38.3 13.6l-6.6.8v-2.5c0-4.3 4.6-12.8 9.5-17.5 4.7-4.7 12.6-9 19.2-10.5 5.2-1.2 14.9-1.3 20.2 0m10 31.5c3.2 4.7 9.6 9.9 15.4 12.4l4.7 2.1v21.4c0 17.1-.3 22.4-1.6 26.2-3.6 10.4-11.4 18.1-22.9 22.5-8.4 3.2-23.5 3.2-31.5-.1-7.2-3-14.4-8.4-17.9-13.5-5.4-7.8-6.1-11.7-6.1-34.6 0-20.9 0-21 2.3-21.4 1.2-.2 6-1 10.7-1.6 14-1.9 30.2-7.9 40.5-14.9 1.7-1.2 3.2-2.1 3.5-2.1s1.6 1.6 2.9 3.6M267.4 190c1.9 8.6 5.1 17 8.2 21.5 2.3 3.5 2.4 3.9.9 5.5-7.8 8.6-33.2 8.6-41 0-1.5-1.6-1.4-2 .9-5.5 3.1-4.5 6.3-12.9 8.2-21.5l1.5-6.5h19.8zm-43 38.6c7.1 5.4 13.9 8.7 21.4 10.3 14.6 3.1 28.8-.4 41.8-10.3l6.2-4.6h13.9c14.5 0 20.7 1.1 28.7 5.2 5.2 2.7 13.9 11 17 16.2 2.4 4.1 19.6 50.7 19.6 53.1 0 1.2-49.9 21.9-50.8 21.1-.6-.6 7.2-23.1 10.8-31 3.6-8.2 3.8-10.9.5-14.1-2.9-3-7.4-3.3-10.4-.8-3.9 3.4-14.1 30.6-18.6 49.8-3.3 14.3-4.8 28.1-4.3 39.5l.5 9.9-2.6.6c-5.2 1-29.9 2.5-42.6 2.5-12.8 0-34.9-1.4-41-2.6l-3.2-.6.5-9.8c.5-11.4-1-25.3-4.3-39.5-4.5-19.2-14.7-46.4-18.6-49.8-3-2.5-7.5-2.2-10.4.8-3.3 3.2-3.1 5.9.5 14.1 3.6 7.9 11.4 30.4 10.8 31-1 .9-50.8-19.9-50.8-21.2 0-2.4 17.2-48.8 19.6-53 2.9-5 11.7-13.4 16.5-15.9 8.1-4.3 13.9-5.4 28.8-5.4l14.3-.1zm-61.1 98.1c4.4 1.7 6.7 3.2 6.7 4.2 0 .9-3.3 12.4-7.3 25.5-6.1 20.1-7.6 24.2-9.8 25.9-2.6 1.9-2.8 1.9-26-.2-13.3-1.2-26.9-3-31.5-4.2-5.8-1.5-10.1-2-15.5-1.7-5.9.4-54.6-3.3-60.9-4.5-2-.4 8-6.8 15.6-10 8.1-3.4 19.8-5.7 29.1-5.7 4.3 0 21.2 1.1 37.5 2.4 22.4 1.9 30.7 2.2 33.5 1.4 5.8-1.6 9.5-6.2 12.1-15.4 6.4-22 6.2-21.6 8-20.9.9.3 4.7 1.8 8.5 3.2m198.1 4.5c1.4 4.6 3.3 11.2 4.2 14.7 2.1 7.5 6.2 12.4 11.7 13.9 2.8.8 11.1.5 33.5-1.4 36.7-2.9 44.2-3 55.2-.4 9 2.2 20.5 7.3 25.5 11.5l3 2.4-2.5.1c-1.4 0-13.7 1-27.5 2.3-13.7 1.3-28.6 2.1-33 1.9-5.6-.2-9.4.1-12.5 1.2-2.5.9-16.1 2.8-30.9 4.2-32.1 3.2-29.9 3.9-34.7-11.4-1.7-5.6-3.7-10.9-4.4-11.6-1.9-2.4-6.8-3-9.6-1.1-4.5 2.9-4.7 5.7-1.5 16.4 3.8 12.9 6.3 17.5 11.3 21.1 5 3.7 10.6 5.3 16.9 4.8 2.7-.1 4.5 0 4.1.4s-8.2 4.3-17.4 8.7l-16.7 8-2-3.2c-2.6-4.4-12.5-27.1-15.1-34.8-2.6-7.5-3.5-19.2-2.6-31.1l.8-8.6 4.2-1.6c2.3-.9 4.4-1.6 4.8-1.6.3 0 1.1 2 1.7 4.4 1.6 6.3 4.1 9 8.4 9 6.7 0 9.4-4.6 7.2-12.1-2.3-7.6-2.3-7.7 6.3-11.1 4.2-1.7 8-3.1 8.4-3.1.4-.1 1.8 3.6 3.2 8.1m-170.8 6.4 4.2 1.6.8 8.6c1.5 18.4-.2 27.1-9.1 47.5-6.5 14.7-4.8 13.7-16.2 9.8-5.4-1.9-11.1-4-12.8-4.7l-3-1.2 3-1.2c5-1.9 8.9-5.5 11.6-10.6 1.4-2.7 5.7-15.4 9.5-28.2 3.8-12.7 7.1-23.2 7.3-23.2.3 0 2.4.7 4.7 1.6M231 391c20.1 1.6 42.8 1.1 68-1.5l6.5-.7 3.4 8.3c1.9 4.6 5.4 12.3 7.7 17.1 2.4 4.8 4.4 9 4.4 9.4 0 .7-40.4 20.4-41.9 20.4-.6 0-11.7-3.8-24.7-8.5-12.9-4.7-24.4-8.5-25.3-8.5-1 0-3 .9-4.5 2.1-3.3 2.6-3.7 8.6-.7 11.3 1.1 1 8.9 4.3 17.3 7.3s15.6 5.8 16.1 6.2c.4.4-11.4 6.6-26.2 13.8l-26.8 13.1-66.4-18.9c-41.4-11.8-68-19.9-70.7-21.5-7.8-4.6-12.9-15.3-11.9-25 1.4-13.3 12.5-23.3 25.9-23.4 5 0 13.4 2.8 63.8 21 32 11.6 59.1 21 60.2 21 2.6 0 7.8-5.3 7.8-8 0-3.3-4.9-7.5-11-9.5-3-1-5.7-1.9-5.9-2.1s2.1-6 5-12.9l5.4-12.7 6.5.7c3.6.3 11.7 1 18 1.5m210 3.1c5.5 2.5 10.5 7.1 13.3 12.4 1.7 3.1 2.2 5.8 2.2 12 0 6.9-.4 8.6-2.7 12.6-3.5 5.9-8.4 10.2-13.9 12.3-11.9 4.3-157.3 46.6-158 45.9-.4-.4-3-5.8-5.7-11.9l-5-11.2 20.2-9.8c11-5.4 45.5-22.1 76.6-37.1 54.9-26.6 56.6-27.3 62.5-27.3 3.9 0 7.6.8 10.5 2.1m-175.5 98.8c.5 1.8-.1 2-6.7 2.6-12.4 1.1-42.1.2-42.6-1.3-.2-.8 6.8-4.7 20-11.1l20.3-9.9 4.2 8.9c2.3 4.8 4.4 9.7 4.8 10.8"/>
          </svg>
        </h2>
        <div v-if="loading" class="text-center py-16">Chargement…</div>
        <div v-else-if="error" class="text-center py-16 text-error">
          {{ error }}
        </div>
        <div
          v-else-if="guidedVideos.length"
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <SessionCard v-for="v in guidedVideos" :key="v.id" :video="v" />
        </div>
        <div v-else class="text-center py-16 text-neutral">
          {{
            lastSearch ? "Aucune vidéo trouvée." : "Cliquez sur « Rechercher »."
          }}
        </div>
      </section>
    </main>
  </div>
</template>
