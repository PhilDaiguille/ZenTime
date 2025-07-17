type ThemeName = "ZenTimeLight" | "ZenTimeDawn" | "ZenTimeDusk" | "ZenTimeDark";

interface ThemeState {
  isAutoMode: boolean;
  selectedTheme: ThemeName | null;
}

export const useThemeStore = () => {
  // État initial simple côté serveur
  const themeState = useState<ThemeState>("theme-state", () => ({
    isAutoMode: true,
    selectedTheme: null,
  }));

  // Charger depuis le localStorage côté client uniquement
  const loadStateFromStorage = () => {
    if (import.meta.client && typeof window !== "undefined") {
      const saved = localStorage.getItem("zentime-theme-state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          themeState.value = {
            isAutoMode: parsed.isAutoMode ?? true,
            selectedTheme: parsed.selectedTheme || null,
          };
        } catch (error) {
          console.warn("Erreur lors du chargement de l'état du thème:", error);
        }
      }
    }
  };

  const saveStateToStorage = () => {
    if (import.meta.client) {
      const stateToSave = JSON.stringify(themeState.value);
      localStorage.setItem("zentime-theme-state", stateToSave);
    }
  };

  const setAutoMode = (isAuto: boolean) => {
    themeState.value.isAutoMode = isAuto;
    if (isAuto) {
      themeState.value.selectedTheme = null;
    }
    saveStateToStorage();

    if (import.meta.client) {
      window.dispatchEvent(
        new CustomEvent("theme-mode-changed", {
          detail: {
            autoMode: isAuto,
            selectedTheme: themeState.value.selectedTheme,
          },
        }),
      );
    }
  };

  const setManualTheme = (theme: ThemeName) => {
    themeState.value.isAutoMode = false;
    themeState.value.selectedTheme = theme;
    saveStateToStorage();

    if (import.meta.client) {
      window.dispatchEvent(
        new CustomEvent("theme-mode-changed", {
          detail: {
            autoMode: false,
            selectedTheme: theme,
          },
        }),
      );
    }
  };

  const isAutoMode = computed(() => themeState.value.isAutoMode);
  const selectedTheme = computed(() => themeState.value.selectedTheme);

  return {
    isAutoMode: readonly(isAutoMode),
    selectedTheme: readonly(selectedTheme),

    setAutoMode,
    setManualTheme,
    loadStateFromStorage,
    saveStateToStorage,
  };
};
