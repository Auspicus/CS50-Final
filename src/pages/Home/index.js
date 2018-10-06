import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {XYPlot, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import 'react-vis/dist/style.css';

import './styles.css';

class Graph extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      c: [],
      js: [],
    }
  }

  calculateJS() {
    setTimeout(() => {
      let fib1 = 0;
      let fib2 = 1;
      let fib3 = 2;
  
      var before = Date.now();
      while (fib1 + fib2 < (Math.pow(2, 31) - 1))
      {
        fib3 = fib1 + fib2;
        fib1 = fib2;
        fib2 = fib3;
      }
      var after = Date.now();
  
      this.setState({
        js: [...this.state.js, after - before],
      });
      this.calculateJS();
    });
  }

  calculateC() {
    fetch('/execute', {
      method: 'POST',
    })
    .then(response => response.json())
    .then((response) => {
      this.setState({
        c: [...this.state.c, response.result],
      });
      this.calculateC();
    })
    .catch(console.error)
  }

  componentDidMount() {
    this.calculateJS();
    this.calculateC();
  }

  render() {
    return (
      <div className="graph">
        <XYPlot
          margin={{ left: 60 }}
          style={{
            margin: '0 auto',
          }}
          width={300}
          height={300}>
          <HorizontalGridLines />
          <LineSeries
            data={this.state.c.map((y, x) => ({ x, y: y }))}/>
          <LineSeries
            data={this.state.js.map((y, x) => ({ x, y: y / 1000 }))}/>
          <YAxis title="Calculation time (sec)" />
        </XYPlot>
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet title="NodeJS to C++ Bindings - Fibonacci" />
        <div style={{
          margin: '0 auto',
          maxWidth: '560px',
          textAlign: 'center',
        }}>
          <h1>Graph of Fibonacci Series</h1>
          <Graph />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
