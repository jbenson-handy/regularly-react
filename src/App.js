import React, { Component } from 'react';
import moment from 'moment';
import './App.css';
import Post from './components/Post.js';
import More from './components/More.js';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = { dueDates: [], fetchCount: 0 }
  }

  componentDidMount() {
    this.fetchInitialState()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>More Music Every Week</h2>
        </div>
        <div className="App-intro">
          {this.availableDueDates().map(payload => (
              <Post
                key={payload.id}
                user={payload.user}
                embeds={payload.embeds}
                dueDate={payload.dueDate}
                />
            )
          )}
          <More moreDueDates={this.moreDueDates} />
        </div>
      </div>
    );
  }

  fetchAndSetState(request) {
    return fetch(request).then((response) => {
      return response.json().then((json) => {
        return this.setState((previousState, currentProps) => {
          return {
            dueDates: json.dueDates,
            fetchCount: previousState.fetchCount + 1
          }
        })
      })
    })
  }

  fetchInitialState() {
    let from = moment().format()
    let to = moment().subtract(3, 'weeks').format()
    let queryString = `?from=${from}&to=${to}`
    let request = new Request('/api/v1/calendar' + queryString)
    return this.fetchAndSetState(request)
  }

  moreDueDates() {
    let lastSelection = this.state[-1];
    if (lastSelection == null) {
      return;
    } {
      let to = moment(lastSelection.dueDate).subtract(3, 'weeks').format()
      let queryString = `?from=${lastSelection.dueDate}&to=${to}`
      let request = new Request('/api/v1/calendar' + queryString)
      this.fetchAndSetState(request)
    }
  }


  availableDueDates() {
    let dueDates = []

    if (this.state == null) {
      dueDates = []
    } else {
      dueDates = this.state.dueDates
    }

    return dueDates
  }
}

export default App;
