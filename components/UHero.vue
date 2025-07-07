<template>
  <div
    class="hero bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 min-h-screen relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"
      />
      <div
        class="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"
      />
      <div
        class="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"
      />
    </div>

    <div class="hero-content text-center relative z-10">
      <div class="max-w-2xl">
        <div class="mb-8">
          <h1
            class="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            ZenTime
          </h1>
        </div>

        <p
          class="text-xl md:text-2xl leading-relaxed text-base-content/80 mb-8"
        >
          Plongez dans un univers de
          <span class="font-semibold text-primary">sérénité</span> avec nos
          playlists Lofi soigneusement sélectionnées. Laissez-vous porter par
          des mélodies apaisantes qui transforment votre espace en un
          <span class="font-semibold text-secondary">havre de paix</span>.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <NuxtLink
            to="/session"
            class="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Commencer l'évasion
          </NuxtLink>
          <button class="btn btn-outline btn-lg">
            Découvrir les playlists
          </button>
        </div>

        <div
          class="mt-12 flex justify-center items-center gap-8 text-sm text-base-content/60"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>200+ playlists</span>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"
            />
            <span>10K+ utilisateurs</span>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000"
            />
            <span>Gratuit</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
