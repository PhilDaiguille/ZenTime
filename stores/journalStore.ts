import { defineStore } from 'pinia'

interface Entry {
    date: string
    mood: string
    note: string
}

export const useJournalStore = defineStore('journal', {
    state: () => ({
        entries: [] as Entry[],
    }),
    getters: {
        chartLabels(state) {
            return state.entries.map((e) => e.date)
        },
        chartDataPoints(state) {
            const moodScores = {
                "😢": 1,
                "😐": 2,
                "🙂": 3,
                "😁": 4,
            } as Record<string, number>
            return state.entries.map((e) => moodScores[e.mood] || 0)
        },
    },
    actions: {
        addEntry(entry: Entry) {
            this.entries.push(entry)
            this.saveToLocalStorage()
        },
        clearEntries() {
            this.entries = []
            localStorage.removeItem('zen-history')
        },
        loadFromLocalStorage() {
            const saved = localStorage.getItem('zen-history')
            if (saved) {
                this.entries = JSON.parse(saved)
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('zen-history', JSON.stringify(this.entries))
        },
    },
})
