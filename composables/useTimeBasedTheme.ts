type ThemeName = "ZenTimeLight" | "ZenTimeDawn" | "ZenTimeDusk" | "ZenTimeDark";
type PeriodName = "Aube" | "Jour" | "Crépuscule" | "Nuit";

interface ThemePeriod {
  start: number;
  end: number;
  theme: ThemeName;
  name: PeriodName;
}

interface TimeToNextChange {
  hours: number;
  minutes: number;
  nextPeriod: PeriodName;
}

interface ThemeChangeDetail {
  theme: ThemeName;
  period: PeriodName;
  hour: number;
}

let globalThemeInterval: NodeJS.Timeout | null = null;

export const useTimeBasedTheme = () => {
  const currentTheme = ref<ThemeName>("ZenTimeLight");

  const timeThemes: Record<string, ThemePeriod> = {
    dawn: { start: 5, end: 8, theme: "ZenTimeDawn", name: "Aube" },
    day: { start: 8, end: 17, theme: "ZenTimeLight", name: "Jour" },
    dusk: { start: 17, end: 20, theme: "ZenTimeDusk", name: "Crépuscule" },
    night: { start: 20, end: 5, theme: "ZenTimeDark", name: "Nuit" },
  } as const;

  const getThemeByTime = (): ThemePeriod => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= timeThemes.dawn.start && hour < timeThemes.dawn.end) {
      return timeThemes.dawn;
    } else if (hour >= timeThemes.day.start && hour < timeThemes.day.end) {
      return timeThemes.day;
    } else if (hour >= timeThemes.dusk.start && hour < timeThemes.dusk.end) {
      return timeThemes.dusk;
    } else {
      return timeThemes.night;
    }
  };

  const applyTheme = (theme: ThemeName): void => {
    if (import.meta.client) {
      document.documentElement.setAttribute("data-theme", theme);
      currentTheme.value = theme;
    }
  };

  const updateTheme = (): void => {
    const themeStore = useThemeStore();
    if (!themeStore.isAutoMode.value) {
      return;
    }

    const currentPeriod = getThemeByTime();
    applyTheme(currentPeriod.theme);

    if (import.meta.client) {
      window.dispatchEvent(
        new CustomEvent<ThemeChangeDetail>("theme-changed", {
          detail: {
            theme: currentPeriod.theme,
            period: currentPeriod.name,
            hour: new Date().getHours(),
          },
        }),
      );
    }
  };

  const startAutoTheme = (): void => {
    if (import.meta.client) {
      updateTheme();

      globalThemeInterval = setInterval(updateTheme, 60000);
    }
  };

  const stopAutoTheme = (): void => {
    if (globalThemeInterval) {
      clearInterval(globalThemeInterval);
      globalThemeInterval = null;
    }
  };

  const setManualTheme = (theme: ThemeName): void => {
    stopAutoTheme();
    applyTheme(theme);
  };

  const getCurrentPeriod = (): ThemePeriod => {
    return getThemeByTime();
  };

  const getTimeToNextChange = (): TimeToNextChange => {
    const now = new Date();
    const currentHour = now.getHours();

    let nextChangeHour: number;
    if (currentHour < 5) nextChangeHour = 5;
    else if (currentHour < 8) nextChangeHour = 8;
    else if (currentHour < 17) nextChangeHour = 17;
    else if (currentHour < 20) nextChangeHour = 20;
    else nextChangeHour = 5 + 24;

    const nextChange = new Date();
    if (nextChangeHour >= 24) {
      nextChange.setDate(nextChange.getDate() + 1);
      nextChange.setHours(nextChangeHour - 24, 0, 0, 0);
    } else {
      nextChange.setHours(nextChangeHour, 0, 0, 0);
    }

    const diff = nextChange.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, nextPeriod: getNextPeriod() };
  };

  const getNextPeriod = (): PeriodName => {
    const currentHour = new Date().getHours();

    if (currentHour < 5) return timeThemes.dawn.name;
    else if (currentHour < 8) return timeThemes.day.name;
    else if (currentHour < 17) return timeThemes.dusk.name;
    else if (currentHour < 20) return timeThemes.night.name;
    else return timeThemes.dawn.name;
  };

  onUnmounted(() => {
    stopAutoTheme();
  });

  return {
    currentTheme: readonly(currentTheme),
    timeThemes,
    startAutoTheme,
    stopAutoTheme,
    setManualTheme,
    updateTheme,
    getCurrentPeriod,
    getTimeToNextChange,
    applyTheme,
  };
};
