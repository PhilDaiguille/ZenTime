<template>
  <div>
    <UHero />
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-base-content mb-4">
            Découvrez votre oasis sonore
          </h2>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            Transformez chaque instant en moment de sérénité avec nos
            expériences audio immersives
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="card-body items-center text-center">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 class="card-title text-xl mb-2 text-center">
                Playlists Curées
              </h3>
              <p class="text-base-content/70">
                Musiques Lofi sélectionnées par nos experts pour chaque moment
                de votre journée
              </p>
            </div>
          </div>

          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="card-body items-center text-center">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 class="card-title text-xl mb-2 text-center">
                Ambiances Naturelles
              </h3>
              <p class="text-base-content/70">
                Sons de la nature, pluie douce et bruits blancs pour une
                relaxation profonde
              </p>
            </div>
          </div>

          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="card-body items-center text-center">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="card-title text-xl mb-2 text-center">
                Sessions Chronométrées
              </h3>
              <p class="text-base-content/70">
                Minuteur intégré pour vos sessions de travail, méditation ou
                repos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-base-200/50">
      <div class="max-w-4xl mx-auto px-4">
        <div
          class="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100 w-full"
        >
          <div class="stat place-items-center">
            <div class="stat-title">Utilisateurs Zen</div>
            <div class="stat-value text-primary">10K+</div>
            <div class="stat-desc">Trouvent leur paix intérieure</div>
          </div>

          <div class="stat place-items-center">
            <div class="stat-title">Heures d'Écoute</div>
            <div class="stat-value text-secondary">50K+</div>
            <div class="stat-desc">De pure sérénité</div>
          </div>

          <div class="stat place-items-center">
            <div class="stat-title">Playlists</div>
            <div class="stat-value text-accent">200+</div>
            <div class="stat-desc">Soigneusement sélectionnées</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 bg-base-200/30">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-base-content mb-4">
            Questions Fréquentes
          </h2>
          <p class="text-lg text-base-content/70">
            Tout ce que vous devez savoir sur ZenTime
          </p>
        </div>

        <div class="max-w-2xl mx-auto">
          <UAccordion />
        </div>
      </div>
    </section>

    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div
          class="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl"
        >
          <div class="card-body">
            <h2
              class="card-title text-3xl md:text-4xl font-bold justify-center mb-4"
            >
              Prêt à commencer votre voyage zen ?
            </h2>
            <p class="text-lg mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont trouvé leur paix
              intérieure avec ZenTime
            </p>
            <div class="card-actions justify-center">
              <NuxtLink
                to="/session"
                class="btn btn-secondary btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Commencer l'évasion
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
