import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { FlexibleXYPlot, YAxis, HorizontalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis';
import 'react-vis/dist/style.css';

const API = process.env.NODE_ENV == "production" ?
  'https://secret-thicket-57834.herokuapp.com' :
  'http://localhost:8080';


const max = Math.pow(2, 31) - 1;
const nanoseconds = 1;
const microseconds = nanoseconds * 1000;
const milliseconds = microseconds * 1000;

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outliers: false,
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

      this.setState({
        js: [...this.state.js, benchmark],
      });

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
    const avgJs = this.state.js.reduce((a, b) => a + b, 0) / this.state.js.length / milliseconds;
    const avgGo = this.state.go.reduce((a, b) => a + b, 0) / this.state.go.length / milliseconds;
    return (
      <div style={{
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '2rem',
        }}>
          Go is running {((avgJs / avgGo) * 100).toFixed(0)}% faster than Javascript
        </div>
        <FlexibleXYPlot
          yDomain={[0, 250]}
          height={300}>
          <HorizontalGridLines />
          <DiscreteColorLegend items={[
            {
              title: 'Javascript',
              color: 'red',
            },
            {
              title: 'Go',
              color: 'green',
            }
          ]} />
          <LineSeries
            data={this.state.js.filter(y => !(y == 0 && this.state.outliers)).map((y, x) => ({ x, y: y / milliseconds }))}
            color="red" />
          <LineSeries
            data={this.state.go.map((y, x) => ({ x, y: y / milliseconds }))}
            color="green" />
          <YAxis title="Compute time (milliseconds)" />
        </FlexibleXYPlot>
      </div>
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
          maxWidth: '960px',
          textAlign: 'center',
        }}>
          <h1>
            Go vs Javascript - Fibonacci
          </h1>
          <p>
            While Javascript can be great for prototyping and UI interactions, it doesn't hold up as well when put under the microscope of performance. Here we have a benchmark of Go and Javascript calculating the Fibonacci series up to the max value of an integer (2^31 - 1) one million times. We can see that Go vastly outperforms Javascript here.
          </p>
          <p>
            It's worth noting that the V8 engine (which Chrome uses to run Javascript in your browser) does a lot to optimize Javascript. In the context of this benchmark, V8 will often "optimize" the fibonacci function by caching the output of certain operations and so the process ends up taking virtually no time at all. These outlier benchmarks have been excluded for the purpose of comparison.
          </p>
          <Graph />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
