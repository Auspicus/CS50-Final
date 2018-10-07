import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { XYPlot, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import 'react-vis/dist/style.css'

const API = process.env.NODE_ENV == "production" ?
  'https://secret-thicket-57834.herokuapp.com' :
  'http://localhost:8080';

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      go: [],
      js: []
    }

    this.runGo = this.runGo.bind(this);
    this.runJs = this.runJs.bind(this);
  }

  runGo() {
    fetch(`${API}/calculate`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        go: [...this.state.go, response.nanoseconds],
      });
      setTimeout(() => {
        this.runGo();
      }, 1000);
    });
  }

  runJs() {
    setTimeout(() => {
      let fib1 = 0;
      let fib2 = 1;
      let fib3 = 2;
      let l1 = 0;
      const max = Math.pow(2, 31) - 1;
      const nanoseconds = 1;
      const microseconds = nanoseconds * 1000;
      const milliseconds = microseconds * 1000;
    
      let before = performance.now();
      while (l1 < 1000 * 1000) {
        while (fib1 + fib2 < max) {
          fib3 = fib1 + fib2;
          fib1 = fib2;
          fib2 = fib3;
        }
        
        fib1 = 0;
        fib2 = 1;
        fib3 = 2;
        l1++;
      }
      let after = performance.now();
      let benchmark = (after - before) * milliseconds;

      if (benchmark !== 0) {
        this.setState({
          js: [...this.state.js, benchmark],
        });
      }

      setTimeout(() => {
        this.runJs();
      }, 1000);
    });
  }

  componentDidMount() {
    this.runGo();
    this.runJs();
  }

  render() {
    return (
      <React.Fragment>
        <h2>Benchmark (Go)</h2>
        <XYPlot
          margin={{ left: 60 }}
          width={350}
          height={300}>
          <HorizontalGridLines />
          <LineSeries
            data={this.state.go.map((y, x) => ({ x, y: (y / (1000 * 1000)) }))} />
          <YAxis title="Compute time (milliseconds)" />
        </XYPlot>
        <h2>Benchmark (Javascript)</h2>
        <XYPlot
          margin={{ left: 80 }}
          width={350}
          height={300}>
          <HorizontalGridLines />
          <LineSeries
            data={this.state.js.map((y, x) => ({ x, y: (y / (1000 * 1000)) }))} />
          <YAxis title="Compute time (milliseconds)" />
        </XYPlot>
      </React.Fragment>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet title="Go vs Javascript - Fibonacci" />
        <div style={{
          margin: '0 auto',
          maxWidth: '960px'
        }}>
          <h1 style={{
            textAlign: 'center'
          }}>
            Go vs Javascript - Fibonacci
          </h1>
          <Graph />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
