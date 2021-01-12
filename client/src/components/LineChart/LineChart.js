import React, { Component } from 'react'
import Chart from "chart.js";
import moment from 'moment';
import 'chartjs-plugin-zoom';



class LineChart extends Component {
  chartRef = React.createRef();

    /**
     * Creates a new chart and renders it into an HTML canvas
     */
  componentDidMount() {
    const s = this.props.data.sort((a, b) => a.sid - b.sid);
    const data = s.map(({ wait }) => wait);
    const labels = s.map(({ sid }) => moment(sid).format('hh:mm A'));

    new Chart(this.chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
            label: "Average Wait Time (minutes)",
            fill: false,
            borderColor: "#58a6ff",
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#58a6ff',
            pointBorderWidth: 2,
            lineTension: .3,
            cubicInterpolationMode: 'default',
            data,
            // Basically only draws every 5th point
            pointRadius: (ctx) => {
                if(ctx.dataIndex % 5 === 0) return 4;
                return 0;
            },
          }
        ]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
              }
            }],
            yAxes: [{
              stacked: true,
              gridLines: {
                display: false,
              }
            }]
          },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: true,
                        drag: true,
                        mode: 'xy'
                    }
                }
            }
      },
    });
  }


  render() {
    return (
        <div className={this.props.className}>
          <canvas
              id="myChart"
              ref={this.chartRef}
          />
        </div>
    )
  }
}

export default LineChart;