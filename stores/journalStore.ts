import { defineStore } from "pinia";

interface Entry {
  date: string;
  mood: string;
  note: string;
}

// store Pinia pour gérer les entrées du journal
export const useJournalStore = defineStore("journal", {
  state: () => ({
    entries: [] as Entry[],
  }),
  getters: {
    //retourne la liste des dates
    chartLabels(state) {
      return state.entries.map((e) => e.date);
    },
    // convertit les humeurs en scores numériques (axe Y)
    chartDataPoints(state) {
      const moodScores: Record<string, number> = {
        sad: 1,
        neutre: 2,
        happy: 3,
        extrahappy: 4,
        lovely: 5,
      };
      return state.entries.map((e) => moodScores[e.mood] || 0);
    },
  },
  actions: {
    // ajout d'une nouvelle entrée et sauvegarde localement
    addEntry(entry: Entry) {
      this.entries.push(entry);
      this.saveToLocalStorage();
    },

    // vide les entrées et la sauvegarde locale
    clearEntries() {
      this.entries = [];
      localStorage.removeItem("zen-history");
    },

    //rechargement depuis le local storage
    loadFromLocalStorage() {
      const saved = localStorage.getItem("zen-history");
      if (saved) {
        this.entries = JSON.parse(saved);
      }
    },

    // sauvegarde dans le local storage
    saveToLocalStorage() {
      localStorage.setItem("zen-history", JSON.stringify(this.entries));
    },
  },
});
