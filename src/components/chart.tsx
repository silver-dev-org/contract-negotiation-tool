import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Chart({
  xValues,
  yValues,
}: {
  xValues: number[];
  yValues: number[];
}) {
  return (
    <Line
      className="p-4"
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
              color: "white",
            },
            ticks: {
              color: "white",
            },
          },
          y: {
            grid: {
              color: "#4d4d4d",
            },
            ticks: {
              color: "white",
              callback: (value) => {
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value as number);
              },
            },
            title: {
              display: true,
              text: "Fees",
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => `${tooltipItems[0].label} placements`,
            },
          },
        },
      }}
      data={{
        labels: xValues,
        datasets: [
          {
            label: "Fee",
            pointBackgroundColor: "white",
            borderColor: "#fa4529",
            data: yValues,
          },
        ],
      }}
    />
  );
}
