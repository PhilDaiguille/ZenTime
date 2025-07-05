import { ref } from '#imports'
import type { Ref } from 'vue'

// Types pour les données YouTube
interface YouTubeThumbnail {
    url: string
    width: number
    height: number
}

interface YouTubeThumbnails {
    default?: YouTubeThumbnail
    medium?: YouTubeThumbnail
    high?: YouTubeThumbnail
}

interface YouTubeSnippet {
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    thumbnails: YouTubeThumbnails
}

interface YouTubeSearchItem {
    id: {
        videoId: string
    }
    snippet: YouTubeSnippet
}

interface YouTubeVideoDetails {
    id: string
    contentDetails: {
        duration: string
    }
    snippet: YouTubeSnippet
}

interface YouTubeSearchResponse {
    items: YouTubeSearchItem[]
    nextPageToken?: string
    prevPageToken?: string
}

interface YouTubeVideosResponse {
    items: YouTubeVideoDetails[]
}

// Type pour une session vidéo transformée
export interface VideoSession {
    id: string
    title: string
    thumbnail: string
    channel: string
    videoUrl: string
    description: string
    publishedAt: string
    duration: number | null
    durationText: string
}

// Type pour le type de recherche
type SearchType = 'general' | 'audio' | 'video'

// Interface de retour du composable
interface UseYouTubeSearchReturn {
    sessions: Ref<VideoSession[]>
    isLoading: Ref<boolean>
    search: (query: string, pageToken?: string, type?: SearchType) => Promise<void>
    goNextPage: () => void
    goPrevPage: () => void
    nextPageToken: Ref<string | null>
    prevPageToken: Ref<string | null>
}

export function useYouTubeSearch(): UseYouTubeSearchReturn {
    const sessions: Ref<VideoSession[]> = ref([])
    const isLoading: Ref<boolean> = ref(false)
    const nextPageToken: Ref<string | null> = ref(null)
    const prevPageToken: Ref<string | null> = ref(null)
    const currentQuery: Ref<string> = ref('')

    const API_KEY: string = 'AIzaSyA3fy6lq27NG0N-0zL42FejHD1nC1DV0To'

    const search = async (query: string, pageToken: string = '', type: SearchType = 'general'): Promise<void> => {
        isLoading.value = true
        currentQuery.value = query

        const searchUrl: string = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}&pageToken=${pageToken}`

        try {
            const res: Response = await fetch(searchUrl)
            const data: YouTubeSearchResponse = await res.json()

            if (!data.items) {
                sessions.value = []
                return
            }

            const videoIds: string = data.items.map(item => item.id.videoId).join(',')
            const detailsUrl: string = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`

            const detailsRes: Response = await fetch(detailsUrl)
            const detailsData: YouTubeVideosResponse = await detailsRes.json()

            sessions.value = data.items
                .filter((item: YouTubeSearchItem): boolean => {
                    const title: string = item.snippet.title.toLowerCase()
                    const description: string = item.snippet.description.toLowerCase()

                    if (type === 'audio') {
                        return title.includes('music') ||
                            title.includes('musique') ||
                            title.includes('ambient') ||
                            title.includes('instrumental') ||
                            title.includes('piano') ||
                            title.includes('guitar') ||
                            title.includes('sounds') ||
                            title.includes('nature sounds') ||
                            title.includes('relaxing music') ||
                            title.includes('calm music') ||
                            title.includes('meditation music') ||
                            title.includes('background music') ||
                            title.includes('chill music') ||
                            title.includes('peaceful music')
                    } else if (type === 'video') {
                        const isMusic: boolean = title.includes('music only') ||
                            title.includes('musique seulement') ||
                            title.includes('instrumental only') ||
                            title.includes('piano solo') ||
                            title.includes('guitar solo') ||
                            title.includes('background music') ||
                            (title.includes('music') && !title.includes('guided') && !title.includes('meditation') && !title.includes('asmr'))

                        const isGuided: boolean = title.includes('meditation') ||
                            title.includes('méditation') ||
                            title.includes('hypnose') ||
                            title.includes('hypnosis') ||
                            title.includes('guided') ||
                            title.includes('guidé') ||
                            title.includes('relaxation') ||
                            title.includes('sommeil') ||
                            title.includes('sleep') ||
                            title.includes('concentration') ||
                            title.includes('mindfulness') ||
                            title.includes('pleine conscience') ||
                            title.includes('breathing') ||
                            title.includes('respiration') ||
                            title.includes('yoga') ||
                            title.includes('zen') ||
                            title.includes('calm') ||
                            title.includes('stress relief') ||
                            title.includes('anti-stress') ||
                            title.includes('therapy') ||
                            title.includes('thérapie') ||
                            title.includes('wellness') ||
                            title.includes('bien-être') ||
                            title.includes('healing') ||
                            title.includes('guérison')

                        const isASMR: boolean = title.includes('asmr')

                        return !isMusic && (isGuided || isASMR)
                    }
                    return true
                })
                .map((item: YouTubeSearchItem): VideoSession => {
                    const details: YouTubeVideoDetails | undefined = detailsData.items.find((d: YouTubeVideoDetails) => d.id === item.id.videoId)
                    const duration: number | null = details ? parseDuration(details.contentDetails.duration) : null

                    return {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails?.high?.url ||
                            item.snippet.thumbnails?.medium?.url ||
                            item.snippet.thumbnails?.default?.url || '',
                        channel: item.snippet.channelTitle,
                        videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
                        description: item.snippet.description,
                        publishedAt: item.snippet.publishedAt,
                        duration: duration,
                        durationText: duration ? formatDuration(duration) : 'N/A'
                    }
                })

            nextPageToken.value = data.nextPageToken || null
            prevPageToken.value = data.prevPageToken || null
        } catch (err: unknown) {
            console.error('Erreur YouTube API', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const parseDuration = (duration: string): number => {
        const match: RegExpMatchArray | null = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
        if (!match) return 0

        const hours: number = parseInt(match[1] || '0')
        const minutes: number = parseInt(match[2] || '0')
        const seconds: number = parseInt(match[3] || '0')

        return hours * 3600 + minutes * 60 + seconds
    }

    const formatDuration = (seconds: number): string => {
        const hours: number = Math.floor(seconds / 3600)
        const minutes: number = Math.floor((seconds % 3600) / 60)
        const secs: number = seconds % 60

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        } else {
            return `${minutes}m ${secs}s`
        }
    }

    const goNextPage = (): void => {
        if (nextPageToken.value && currentQuery.value) {
            search(currentQuery.value, nextPageToken.value)
        }
    }

    const goPrevPage = (): void => {
        if (prevPageToken.value && currentQuery.value) {
            search(currentQuery.value, prevPageToken.value)
        }
    }

    return {
        sessions,
        isLoading,
        search,
        goNextPage,
        goPrevPage,
        nextPageToken,
        prevPageToken
    }
}