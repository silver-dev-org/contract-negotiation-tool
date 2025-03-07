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

export function Chart({ fees }: { fees: number[] }) {
  const currentDate = new Date();
  const months: Map<string, string> = new Map();
  for (let i = 0; i < 12; i++) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() + i);
    months.set(
      month.toLocaleString("default", { month: "short" }),
      month.toLocaleString("default", { month: "long" })
    );
  }

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
                  currencyDisplay: "symbol",
                  notation: "compact",
                }).format(value as number);
              },
            },
          },
        },
        plugins: {
          legend: {
            onClick: () => {},
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => months.get(tooltipItems[0].label),
              label: (tooltipItem) => "$" + tooltipItem.formattedValue,
            },
          },
        },
      }}
      data={{
        labels: months.keys().toArray(),
        datasets: [
          {
            label: "Accumulated fee",
            pointBackgroundColor: "white",
            borderColor: "#fa4529",
            data: fees,
          },
        ],
      }}
    />
  );
}
