<script setup lang="ts">
import ThemePeriodIndicator from "./ThemePeriodIndicator.vue";
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50">
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <NuxtLink to="/">Accueil</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/session">Session</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/journal">Journal</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/lofi">Chill Lofi</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/parameter">Paramètres</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <NuxtLink to="/" class="btn btn-ghost text-xl">ZenTime 🎶</NuxtLink>
      </div>
      <div class="navbar-end">
        <ThemePeriodIndicator />
      </div>
    </div>
  </header>
</template>
