import { vi } from "vitest";

export const mockNuxtComposables = () => {
  return {
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
      path: "/",
      params: {},
      query: {},
      hash: "",
      name: "index",
    })),
    useState: vi.fn((key: string, init?: () => unknown) => {
      const state = { value: typeof init === "function" ? init() : init };
      return state;
    }),
    useCookie: vi.fn(() => ({ value: null })),
    useHead: vi.fn(),
    useSeoMeta: vi.fn(),
  };
};
