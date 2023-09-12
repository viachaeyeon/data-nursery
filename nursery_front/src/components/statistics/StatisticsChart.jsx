import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";
import theme from "@src/styles/theme";

const S = {
  Wrap: styled.div`
    height: 200px;
    width: 100%;
    /* display: flex;
    flex-direction: column;
    gap: 37px; */
  `,
};

function StatisticsChart({ dailyOutput }) {
  const graphRef = useRef(null);
  let graphInstance = null;

  //   const data1 = [];
  //   for (let i = 0; i < 12; i++) {
  //     const randomNumber = Math.floor(Math.random() * 50) + 1;
  //     data1.push(randomNumber);
  //   }

  useEffect(() => {
    if (dailyOutput === 0) {
      return;
    }
    const graphCtx = graphRef.current?.getContext("2d");

    const annotationline = {
      beforeDraw: (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const ctx = chart.ctx;
          ctx.save();
          // const activePoint = chart.tooltip._active[0];
          ctx.beginPath();
          ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
          ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]); // 세로선 점선 표시
          ctx.strokeStyle = "#C2D6E1"; // 세로 점선 색상
          ctx.stroke();
          ctx.restore();
        }
      },
    };

    console.log(dailyOutput);

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "line",
        data: {
          labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          datasets: [
            {
              data: dailyOutput,
              label: "토마토",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#FB97A3",
              pointBackgroundColor: "#FB97A3",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
          ],
        },
        plugins: [annotationline],
        options: {
          layout: {
            padding: {
              left: 0,
              right: 0,
            },
          },
          maintainAspectRatio: false, //그래프 크기를 조절하기 위해서
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                tickLength: 9,
                tickColor: "#ffffff",
              },
              title: {
                display: true,
                align: "end",
                text: "월",
              },
              ticks: {
                align: "start",
                stepSize: 5,
                color: theme.basic.grey40,
              },
            },
            y: {
              grid: {
                drawOnChartArea: false,
                tickLength: 9,
                tickColor: "#ffffff",
              },
              ticks: {
                stepSize: 10,
              },
              min: 1,
            },
          },
          interaction: {
            intersect: false, // 툴팁 데이터위에 hover했을때만 나오게 하는것 false
          },
          plugins: {
            backgroundBar: {
              barColor: "#F7F7FA", // 배경색상
              borderRadius: 4,
            },
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#4F5B6C",
              borderRadius: 8,
              padding: 16,
              xAlign: "center",
              yAlign: "bottom",
              displayColors: false,
              titleAlign: "center",
              bodyAlign: "center",
              titleColor: "#C2D6E1",
              bodyColor: "#fff",
              callbacks: {
                title: function (context) {
                  return context[0].dataset.label;
                },
                beforeBody: function (context) {
                  return context[0].formattedValue + "개";
                },
                label: function (context) {
                  return "";
                },
              },
            },
          },
        },
      });
    };
    const destroyChart = () => {
      graphInstance?.destroy();
      graphInstance = null;
    };

    destroyChart(); // 기존 차트 파괴
    graphChart();

    return () => {
      destroyChart(); // 컴포넌트가 unmount될 때 차트 파괴
    };
  }, [dailyOutput]);

  return (
    <S.Wrap>
      <canvas width="100%" height={"100%"} ref={graphRef} />
    </S.Wrap>
  );
}

export default StatisticsChart;
