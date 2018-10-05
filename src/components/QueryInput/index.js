import React, { Component } from 'react';

import './styles.css';

class QueryInput extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      result: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch('/execute', {
      method: 'POST',
      body: JSON.stringify({
        query: document.querySelector('#query').value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.text())
    .then(result => this.setState({ result }));
  }

  render() {
    const output = this.state.result ?
      <pre className="query-input__result"><code>{this.state.result}</code></pre> :
      null;

    return (
      <div className="query-input">
        <form onSubmit={this.handleSubmit}>
          <textarea
            onChange={e => console.log(e)}
            className="query-input__textarea"
            name="query"
            id="query"
            cols="30"
            rows="15">
          </textarea>
          <button className="query-input__submit">
            Execute
          </button>
        </form>
        {output}
      </div>
    );
  }
}

export default QueryInput;
