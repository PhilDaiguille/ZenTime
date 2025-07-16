import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import JournalPage from "~/components/JournalPage.vue";

vi.mock("#app", () => ({
  ref: (value: unknown) => ref(value),
}));

describe("JournalPage", () => {
  const mockEntries = [
    {
      date: "2025-07-10",
      mood: "�",
      note: "Journée difficile. Beaucoup de stress et quelques contrariétés.",
    },
    {
      date: "2025-07-11",
      mood: "�",
      note: "Journée normale, rien d'exceptionnel à signaler.",
    },
    {
      date: "2025-07-12",
      mood: "�",
      note: "Journée plutôt positive. Quelques défis au travail mais rien d'insurmontable.",
    },
    {
      date: "2025-07-13",
      mood: "�",
      note: "Excellente journée aujourd'hui ! J'ai réussi à terminer mon projet et j'ai passé du temps de qualité avec ma famille.",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait s'afficher correctement sans entrées", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: [] },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Ton Journal");
    expect(wrapper.text()).toContain("Page vide");
  });

  it("devrait afficher le titre du journal", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: [] },
    });

    expect(wrapper.find("h2").text()).toBe("Ton Journal");
  });

  it("devrait afficher le bouton de suppression", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: [] },
    });

    const deleteButton = wrapper.find("button");
    expect(deleteButton.exists()).toBe(true);
    expect(deleteButton.text()).toBe("Supprimer l'historique");
  });

  it("devrait émettre l'événement 'clear' quand on clique sur supprimer", async () => {
    const wrapper = mount(JournalPage, {
      props: { entries: mockEntries },
    });

    const deleteButton = wrapper.find("button");
    await deleteButton.trigger("click");

    expect(wrapper.emitted("clear")).toBeTruthy();
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });

  it("devrait afficher le bon label pour chaque humeur", () => {
    const singleEntryData = [
      { date: "2025-07-13", mood: "😁", note: "Test joyeux" },
    ];

    const wrapper = mount(JournalPage, {
      props: { entries: singleEntryData },
    });

    expect(wrapper.text()).toContain("Joyeux");
  });

  it("devrait afficher les labels d'humeur corrects", () => {
    const testEntries = [
      { date: "2025-07-13", mood: "😢", note: "Triste" },
      { date: "2025-07-12", mood: "😐", note: "Neutre" },
      { date: "2025-07-11", mood: "🙂", note: "Content" },
      { date: "2025-07-10", mood: "😁", note: "Joyeux" },
    ];

    const expectedLabels: Record<string, string> = {
      "😢": "Triste",
      "😐": "Neutre",
      "🙂": "Content",
      "😁": "Joyeux",
    };

    testEntries.forEach((entry) => {
      const wrapper = mount(JournalPage, {
        props: { entries: [entry] },
      });

      expect(wrapper.text()).toContain(expectedLabels[entry.mood]);
    });
  });

  it("devrait afficher la navigation quand il y a des entrées", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: mockEntries },
    });

    expect(wrapper.text()).toContain("Précédent");
    expect(wrapper.text()).toContain("Suivant");
    expect(wrapper.text()).toContain("1 / 2");
  });

  it("ne devrait pas afficher la navigation quand il n'y a pas d'entrées", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: [] },
    });

    expect(wrapper.text()).not.toContain("Précédent");
    expect(wrapper.text()).not.toContain("Suivant");
  });

  it("devrait désactiver le bouton précédent sur la première page", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: mockEntries },
    });

    const buttons = wrapper.findAll("button");
    const prevButton = buttons.find((btn) => btn.text().includes("Précédent"));

    expect(prevButton?.attributes()).toHaveProperty("disabled");
  });

  it("devrait calculer le nombre de pages correctement", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: mockEntries },
    });

    expect(wrapper.text()).toContain("1 / 2");
  });

  it("devrait gérer les entrées avec du contenu long", () => {
    const longEntry = {
      date: "2025-07-13",
      mood: "🙂",
      note: "Ceci est une très longue note qui contient beaucoup de texte pour tester comment le composant gère les contenus étendus et s'assure que tout s'affiche correctement sans casser la mise en page.",
    };

    const wrapper = mount(JournalPage, {
      props: { entries: [longEntry] },
    });

    expect(wrapper.text()).toContain(longEntry.note);
    expect(wrapper.find(".break-words").exists()).toBe(true);
  });

  it("devrait afficher l'icône et le texte pour les pages vides", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: [] },
    });

    expect(wrapper.text()).toContain("📝");
    expect(wrapper.text()).toContain("📖");
    expect(wrapper.text()).toContain("Page vide");
  });

  it("devrait avoir la structure HTML correcte pour ressembler à un carnet", () => {
    const wrapper = mount(JournalPage, {
      props: { entries: mockEntries },
    });

    expect(wrapper.find(".bg-base-200.rounded-lg").exists()).toBe(true);
    expect(wrapper.find(".bg-base-100.rounded").exists()).toBe(true);
    expect(wrapper.findAll(".flex-1.bg-white")).toHaveLength(2);
  });
});
