import React, { Component } from 'react'
import Chart from "chart.js";
import withPlaceholder from "../../withPlaceholder";

class LineChart extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    new Chart(this.chartRef.current.getContext("2d"), {
      type: "line",

      data: {
        //Bring in data
        labels: ["Jan", "Feb", "March"],
        datasets: [
          {
            label: "Sales",
            data: [86, 67, 91],
          }
        ]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              // ticks: { display: false },
              gridLines: {
                display: false,
                // drawBorder: false
              }
            }],
            yAxes: [{
              // ticks: { display: false },
              gridLines: {
                display: false,
                // drawBorder: false
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