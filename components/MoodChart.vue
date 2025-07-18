<script setup lang="ts">
import { computed } from "vue";
import { Line } from "vue-chartjs";
import type { Chart } from "chart.js";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

const props = defineProps<{
  labels: string[];
  dataPoints: number[];
}>();

const moodImages: Record<number, HTMLImageElement> = {
  1: new Image(),
  2: new Image(),
  3: new Image(),
  4: new Image(),
  5: new Image(),
};

moodImages[1].src = "/images/sad.png";
moodImages[2].src = "/images/neutre.png";
moodImages[3].src = "/images/happy.png";
moodImages[4].src = "/images/extrahappy.png";
moodImages[5].src = "/images/lovely.png";

// plugin personnalisé pour afficher une image sur l'axe Y
const moodLabelPlugin = {
  id: "moodLabelPlugin",
  afterDraw(chart: Chart) {
    const ctx = chart.ctx;
    const yScale = chart.scales.y;

    // pour chaque tick de l’axe Y, on dessine l’image correspondante
    yScale.ticks.forEach((tick, i) => {
      const val = tick.value as number;
      const img = moodImages[val];
      if (img?.complete) {
        const yPos = yScale.getPixelForTick(i);
        ctx.drawImage(img, yScale.left - 28, yPos - 8, 18, 18);
      }
    });
  },
};

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  moodLabelPlugin,
);

//preparation des données du chart
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Niveau d'humeur",
      data: props.dataPoints,
      fill: false,
      borderColor: "#FFD700",
      backgroundColor: "#FFD700",
      tension: 0.4,
      pointRadius: 8,
      pointHoverRadius: 10,
      pointBackgroundColor: "#00000",
      clip: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  layout: {
    padding: {
      left: 30,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    moodLabelPlugin, //activer le plugin
  },
  scales: {
    y: {
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: (value: number) => {
          return value >= 1 && value <= 5 ? "" : value;
        },
      },
      grid: {
        color: "#dcdcdc",
      },
    },
    x: {
      grid: {
        color: "#dcdcdc",
      },
    },
  },
};
</script>
a
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
