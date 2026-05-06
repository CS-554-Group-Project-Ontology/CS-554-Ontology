import { useEffect } from "react";
import ApexCharts, { type ApexOptions } from "apexcharts";
import { usd } from "../../helpers";


type ChartMode = 'incomeVsLiability'|'budget'

interface Liabilities{
    rent?: number;
    insuranceDeductibles?: number;
    utilities?: number;
    other?: number;
}


type ChartProps = {
    mode: ChartMode;
    income: number;
    liabilities: Liabilities;
};

function BudgetCompareBox({
        label,
        actual,
        recommended,
        isBad,
    }: {
        label: string;
        actual: number;
        recommended: number;
        isBad: boolean;
    }) {
    return (
        <div
        className={`rounded-lg border p-3 ${
            isBad
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-green-200 bg-green-50 text-green-700"
        }`}
        >
        <div className="flex items-center justify-between">
            <span className="font-medium">{label}</span>
            <span className="text-sm font-semibold">
            {isBad ? "Over" : "Good"}
            </span>
        </div>

        <p className="mt-1 text-sm">Actual: {usd.format(actual)}</p>
        <p className="text-sm">Recommended: {usd.format(recommended)}</p>
        </div>
    );
}

function MobilityCharts({ income,liabilities,mode }:ChartProps) {
    const chartId =
        mode === "incomeVsLiability"
        ? "income-liability-chart"
        : mode === "budget"
        ? "budget-chart"
        : "unknown-chart"
    
    const rent = liabilities?.rent ?? 0;
    const insurance = liabilities?.insuranceDeductibles ?? 0;
    const utilities = liabilities?.utilities ?? 0;
    const other = liabilities?.other ?? 0;

    const actualNeeds = rent + insurance + utilities;
    const actualWants = other;

    const actualSavings = Math.max(
    income - actualNeeds - actualWants,
    0
    );

    const recommendedNeeds = income * 0.5;
    const recommendedWants = income * 0.3;
    const recommendedSavings = income * 0.2;

    const totalLiabilities = actualNeeds + actualWants;
    const remainingIncome = Math.max(income - totalLiabilities, 0);

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

            return {
                series: [totalLiabilities, remainingIncome],
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
                plotOptions: {
                    pie: {
                        donut: {
                        size: "65%",
                        },
                        dataLabels: {
                        offset: -12,
                        },
                    },
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

                series: [recommendedNeeds,recommendedWants,recommendedSavings],
                labels: ["Needs","Wants","Savings Potential"],
                colors: [brandColor,warningColor,successColor],

                plotOptions: {
                    pie: {
                        dataLabels: {
                        offset: -18,
                        },
                    },
                },

                chart: {
                    height: 420,
                    width: "100%",
                    type: "pie" as const,
                },

                legend: {
                    position: "bottom" as const,
                },

                tooltip: {
                    y: {
                        formatter: function (value: number) {
                        return usd.format(value);
                        },
                    },
                },
            };
        }

        // Can implement as stretch feature however required complete overhaul of user to include month and year and allow for 1 to many
        /*case "aggregate": {
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
        }*/
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
    }, [mode, income, liabilities,chartId]);

    const title =
        mode === "incomeVsLiability"
        ? "Income vs Liabilities"
        : mode === "budget"
        ? "Budget Breakdown"
        : "Unknown chart";

    return (
    <div className="card bg-base-100 w-full shadow-sm">
        <div className="card-body">
            <h2 className="card-title">{title}</h2>

            <div id={chartId} className="w-full" />

            {mode === "budget" && (
                <div className="mt-4 grid grid-cols-1 gap-3">
                    <BudgetCompareBox
                        label="Needs"
                        actual={actualNeeds}
                        recommended={recommendedNeeds}
                        isBad={actualNeeds > recommendedNeeds}
                    />

                    <BudgetCompareBox
                        label="Wants"
                        actual={actualWants}
                        recommended={recommendedWants}
                        isBad={actualWants > recommendedWants}
                    />

                    <BudgetCompareBox
                        label="Savings Room"
                        actual={actualSavings}
                        recommended={recommendedSavings}
                        isBad={actualSavings < recommendedSavings}
                    />
                </div>
            )}
        </div>
    </div>
    );
}
export default MobilityCharts;