import React, { Component } from 'react';
import Helmet from 'react-helmet';

import QueryInput from '../../components/QueryInput';

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet title="NodeJS to C++ Binding Example - Database" />
        <div style={{
          margin: '0 auto',
          maxWidth: '560px',
          textAlign: 'center',
        }}>
          <h1>Database in C++</h1>
          <p>
            This is a proof of concept for a web binding to a basic C++ database application. You can enter SQL syntax below and the server will run it in the C++ binding.
          </p>
          <details>
            <summary>Supported commands</summary>
            <pre style={{ textAlign: 'left' }}>
              <code>
                CREATE TABLE tableName<br/>  (column1 type, column2 type, ...columnN type);<br/>
                <br/>
                INSERT INTO tableName (column1, column2, ...columnN)<br/>  VALUES (value1, value2, ...valueN);<br />
                <br/>
                SELECT * FROM tableName;<br/>
              </code>
            </pre>
          </details>
          <details>
            <summary>Supported data types</summary>
            <ul style={{ textAlign: 'left' }}>
              <li>BOOLEAN</li>
              <li>INTEGER</li>
              <li>NUMERIC</li>
              <li>TEXT</li>
            </ul>
          </details>
          <p style={{ fontStyle: 'italic' }}>Note: the SQL parser is space sensitive so make sure you space it exact and don't include new lines between commands.</p>
          <QueryInput />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
