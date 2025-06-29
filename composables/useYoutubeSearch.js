import { ref } from "vue";

export function useYouTubeSearch() {
  const sessions = ref([]);
  const isLoading = ref(false);
  const nextPageToken = ref(null);
  const prevPageToken = ref(null);
  const currentQuery = ref("");

  const API_KEY = "AIzaSyA3fy6lq27NG0N-0zL42FejHD1nC1DV0To";

  const search = async (query, pageToken = "", type = "general") => {
    isLoading.value = true;
    currentQuery.value = query;

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}&pageToken=${pageToken}`;

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (!data.items) {
        sessions.value = [];
        return;
      }

      const videoIds = data.items.map((item) => item.id.videoId).join(",");
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`;

      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();

      sessions.value = data.items
        .filter((item) => {
          const title = item.snippet.title.toLowerCase();
          const description = item.snippet.description.toLowerCase();

          if (type === "audio") {
            return (
              title.includes("music") ||
              title.includes("musique") ||
              title.includes("ambient") ||
              title.includes("instrumental") ||
              title.includes("piano") ||
              title.includes("guitar") ||
              title.includes("sounds") ||
              title.includes("nature sounds") ||
              title.includes("relaxing music") ||
              title.includes("calm music") ||
              title.includes("meditation music") ||
              title.includes("background music") ||
              title.includes("chill music") ||
              title.includes("peaceful music")
            );
          } else if (type === "video") {
            const isMusic =
              title.includes("music only") ||
              title.includes("musique seulement") ||
              title.includes("instrumental only") ||
              title.includes("piano solo") ||
              title.includes("guitar solo") ||
              title.includes("background music") ||
              (title.includes("music") &&
                !title.includes("guided") &&
                !title.includes("meditation") &&
                !title.includes("asmr"));

            const isGuided =
              title.includes("meditation") ||
              title.includes("méditation") ||
              title.includes("hypnose") ||
              title.includes("hypnosis") ||
              title.includes("guided") ||
              title.includes("guidé") ||
              title.includes("relaxation") ||
              title.includes("sommeil") ||
              title.includes("sleep") ||
              title.includes("concentration") ||
              title.includes("mindfulness") ||
              title.includes("pleine conscience") ||
              title.includes("breathing") ||
              title.includes("respiration") ||
              title.includes("yoga") ||
              title.includes("zen") ||
              title.includes("calm") ||
              title.includes("stress relief") ||
              title.includes("anti-stress") ||
              title.includes("therapy") ||
              title.includes("thérapie") ||
              title.includes("wellness") ||
              title.includes("bien-être") ||
              title.includes("healing") ||
              title.includes("guérison");

            const isASMR = title.includes("asmr");

            return !isMusic && (isGuided || isASMR);
          }
          return true;
        })
        .map((item) => {
          const details = detailsData.items.find(
            (d) => d.id === item.id.videoId,
          );
          const duration = details
            ? parseDuration(details.contentDetails.duration)
            : null;

          return {
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url ||
              "",
            channel: item.snippet.channelTitle,
            videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            duration: duration,
            durationText: duration ? formatDuration(duration) : "N/A",
          };
        });

      nextPageToken.value = data.nextPageToken || null;
      prevPageToken.value = data.prevPageToken || null;
    } catch (err) {
      console.error("Erreur YouTube API", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  const goNextPage = () => {
    if (nextPageToken.value && currentQuery.value) {
      search(currentQuery.value, nextPageToken.value);
    }
  };

  const goPrevPage = () => {
    if (prevPageToken.value && currentQuery.value) {
      search(currentQuery.value, prevPageToken.value);
    }
  };

  return {
    sessions,
    isLoading,
    search,
    goNextPage,
    goPrevPage,
    nextPageToken,
    prevPageToken,
  };
}
