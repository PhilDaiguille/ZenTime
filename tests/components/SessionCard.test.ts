import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SessionCard from "~/components/SessionCard.vue";

Object.defineProperty(window, "YT", {
  value: {
    Player: vi.fn(() => ({
      stopVideo: vi.fn(),
    })),
    PlayerState: {
      ENDED: 0,
    },
  },
  writable: true,
});

describe("SessionCard", () => {
  const mockVideo = {
    id: "test-video-id",
    title: "Test Video Title",
    channel: "Test Channel",
    thumbnail: "https://example.com/thumbnail.jpg",
    duration: 300,
    durationText: "5:00",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait s'afficher correctement avec les données vidéo", () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("devrait afficher le titre et le canal de la vidéo", () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    expect(wrapper.text()).toContain(mockVideo.title);
    expect(wrapper.text()).toContain(mockVideo.channel);
  });

  it("devrait afficher la durée de la vidéo", () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    expect(wrapper.text()).toContain(mockVideo.durationText);
  });

  it("devrait afficher l'image de vignette", () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(mockVideo.thumbnail);
    expect(img.attributes("alt")).toBe(mockVideo.title);
  });

  it("devrait utiliser une image de fallback si aucune vignette n'est fournie", () => {
    const videoWithoutThumbnail = { ...mockVideo, thumbnail: null };
    const wrapper = mount(SessionCard, {
      props: { video: videoWithoutThumbnail },
    });

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(
      "https://via.placeholder.com/480x270?text=ZenTime",
    );
  });

  it('devrait avoir un bouton "Commencer"', () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Commencer");
  });

  it('devrait déclencher l\'ouverture du player au clic sur "Commencer"', async () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.find(".modal-open").exists()).toBe(true);
  });

  it("devrait afficher l'iframe du player YouTube dans le modal", async () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    const iframe = wrapper.find("iframe");
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toContain(
      `youtube.com/embed/${mockVideo.id}`,
    );
  });

  it("devrait avoir un bouton de fermeture dans le modal", async () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    const closeButton = wrapper.find('.modal-box button[aria-label="Fermer"]');
    expect(closeButton.exists()).toBe(true);
    expect(closeButton.text()).toBe("✕");
  });

  it("devrait fermer le modal au clic sur le bouton de fermeture", async () => {
    const wrapper = mount(SessionCard, {
      props: { video: mockVideo },
    });

    const openButton = wrapper.find("button");
    await openButton.trigger("click");
    expect(wrapper.find(".modal-open").exists()).toBe(true);

    const closeButton = wrapper.find('.modal-box button[aria-label="Fermer"]');
    await closeButton.trigger("click");
    expect(wrapper.find(".modal-open").exists()).toBe(false);
  });

  it("devrait accepter et utiliser correctement les props video", () => {
    const customVideo = {
      id: "custom-video-123",
      title: "Ma Vidéo Personnalisée",
      channel: "Mon Canal Zen",
      thumbnail: "https://custom-thumbnail.jpg",
      duration: 720,
      durationText: "12:00",
    };

    const wrapper = mount(SessionCard, {
      props: { video: customVideo },
    });

    expect(wrapper.text()).toContain(customVideo.title);
    expect(wrapper.text()).toContain(customVideo.channel);
    expect(wrapper.text()).toContain(customVideo.durationText);

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(customVideo.thumbnail);
    expect(img.attributes("alt")).toBe(customVideo.title);

    const button = wrapper.find("button");
    button.trigger("click");

    wrapper.vm.$nextTick(() => {
      const iframe = wrapper.find("iframe");
      expect(iframe.attributes("src")).toContain(
        `youtube.com/embed/${customVideo.id}`,
      );
    });
  });

  it("devrait gérer les props manquantes ou nulles", () => {
    const incompleteVideo = {
      id: "test-id",
      title: "Titre seulement",
    };

    const wrapper = mount(SessionCard, {
      props: { video: incompleteVideo },
    });

    expect(wrapper.text()).toContain(incompleteVideo.title);

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(
      "https://via.placeholder.com/480x270?text=ZenTime",
    );
  });
});
