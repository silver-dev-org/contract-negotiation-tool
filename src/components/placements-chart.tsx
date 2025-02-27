import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PlacementsChart({ coords }: { coords: [number, number][] }) {
  return (
    <Line
      options={{
        responsive: true,

        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              color: "#4d4d4d",
            },
            title: {
              display: true,
              text: "Placements",
            },
          },
          y: {
            grid: {
              color: "#4d4d4d",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => `${tooltipItems[0].label} placements`,
            },
          },
        },
      }}
      data={{
        labels: coords.map(([x, y]) => x),
        datasets: [
          {
            label: "Price",
            borderColor: "#fa4529",
            data: coords.map(([x, y]) => y),
          },
        ],
      }}
    />
  );
}
