import { useEffect } from "react";
import ApexCharts, { type ApexOptions } from "apexcharts";


type ChartMode = 'incomeVsLiability'|'budget'|'aggregate'
type MonthlyAggregate = {
    month: string;
    income: number;
    liabilities: number;
};

type ChartProps = {
    mode: ChartMode;
    income: number;
    liabilities: number;
    monthlyData?: MonthlyAggregate[];
};

function MobilityCharts({ income,liabilities,mode,monthlyData = [] }:ChartProps) {
    const chartId =
        mode === "incomeVsLiability"
        ? "income-liability-chart"
        : mode === "budget"
        ? "budget-chart"
        : "aggregate-chart";

    const getCssVar = (name:string,fallback:string)=>{
        return(
            getComputedStyle(document.documentElement).getPropertyValue(name).trim()||fallback
        );
    };

  const getChartOptions = (): ApexOptions => {
    const brandColor = getCssVar("--color-fg-brand", "#1447E6");
    const liabilityColor = getCssVar("--color-error", "#C70036");
    const warningColor = getCssVar("--color-warning", "#F59E0B");
    const successColor = getCssVar("--color-success", "#007A55");
    const neutralColor = getCssVar("--color-neutral-primary", "#FFFFFF");

    switch (mode) {
        case "incomeVsLiability": {
            const remainingIncome = Math.max(income - liabilities, 0);

            return {
            series: [liabilities, remainingIncome],
            labels: ["Liabilities", "Remaining Income"],
            colors: [liabilityColor, brandColor],
            chart: {
                height: 420,
                width: "100%",
                type: "donut" as const,
            },
            stroke: {
                colors: [neutralColor],
            },
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif",
            },
            dataLabels: {
                enabled: true,
                formatter: function (value: number) {
                return value.toFixed(1) + "%";
                },
            },
            };
        }

        case "budget": {
            return {
            series: [income * 0.5, income * 0.3, income * 0.2],
            labels: ["Needs 50%", "Wants 30%", "Savings 20%"],
            colors: [brandColor, warningColor, successColor],
            chart: {
                height: 420,
                width: "100%",
                type: "pie" as const,
            },
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif",
            },
            tooltip: {
                y: {
                formatter: function (value: number) {
                    return "$" + value.toFixed(2);
                },
                },
            },
            };
        }

        case "aggregate": {
            return {
            series: [
                {
                name: "Income",
                data: monthlyData.map((item) => item.income),
                },
                {
                name: "Liabilities",
                data: monthlyData.map((item) => item.liabilities),
                },
            ],
            colors: [brandColor, liabilityColor],
            chart: {
                type: "bar" as const,
                width: "100%",
                height: 400,
                toolbar: {
                show: false,
                },
            },
            plotOptions: {
                bar: {
                horizontal: false,
                borderRadius: 6,
                },
            },
            xaxis: {
                categories: monthlyData.map((item) => item.month),
            },
            yaxis: {
                labels: {
                formatter: function (value: number) {
                    return "$" + value;
                },
                },
            },
            tooltip: {
                y: {
                formatter: function (value: number) {
                    return "$" + value.toFixed(2);
                },
                },
            },
            legend: {
                position: "bottom",
            },
            };
        }
        default: {
            return {
                series: [],
                chart: {
                    type: "bar" as const,
                    height: 400,
                    width: "100%",
                },
            };
        }
    };
}

    useEffect(() => {
    const chartElement = document.getElementById(chartId);

    if (!chartElement) return;

    const chart = new ApexCharts(chartElement, getChartOptions());
    chart.render();

    return () => {
        chart.destroy();
        };
    }, [mode, income, liabilities, monthlyData, chartId]);

    const title =
        mode === "incomeVsLiability"
        ? "Income vs Liabilities"
        : mode === "budget"
        ? "Budget Breakdown"
        : "Monthly Income and Liability Trend";

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
            <h2 className="card-title">{title}</h2>

            <div id={chartId} className="w-full" />
        </div>
        </div>
    );
}
export default MobilityCharts;