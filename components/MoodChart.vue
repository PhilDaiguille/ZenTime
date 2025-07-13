<script setup lang="ts">
import { computed } from 'vue'
import { Line } from "vue-chartjs";
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

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
);

const props = defineProps<{
  labels: string[]
  dataPoints: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Niveau d'humeur",
      data: props.dataPoints,
      fill: false,
      borderColor: "#76b3be",
      backgroundColor: "#76b3be",
      tension: 0.4,
      pointRadius: 8,
      pointHoverRadius: 14,
      pointBackgroundColor: "#ffd47f",
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      suggestedMin: 1,
      suggestedMax: 4,
      ticks: {
        stepSize: 1,
        font: {
          size: 24,
        },
        callback: (value: number) => {
          switch (value) {
            case 1: return "😢"
            case 2: return "😐"
            case 3: return "🙂"
            case 4: return "😁"
            default: return value
          }
        },
      },
    },
  },
};
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
