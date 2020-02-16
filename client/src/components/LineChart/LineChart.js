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
            backgroundColor: '#FF5A60',
            pointBackgroundColor: '#FF5A60',
            data,
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