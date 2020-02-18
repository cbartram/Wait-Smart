import React, { Component } from 'react'
import Chart from "chart.js";
import moment from 'moment';

class LineChart extends Component {
  chartRef = React.createRef();
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
            backgroundColor: 'rgba(255, 90, 96, .8)',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: 'rgb(255, 90, 96)',
            pointBorderWidth: 2,
            lineTension: .6,
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
                display: true,
              }
            }],
            yAxes: [{
              stacked: true,
              gridLines: {
                display: true,
              }
            }]
          }
      }
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