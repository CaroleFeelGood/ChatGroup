import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import Members from './Members';
import Chat from './Chat';

class U_Wall extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Grid className="wall-container">
        <Grid.Column width={5}>
          <Members />
        </Grid.Column>
        <Grid.Column width={10}>
          <Chat />
        </Grid.Column>
      </Grid>
    );
  }
}

let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let Wall = connect(mapStateToProps)(U_Wall);
export default Wall;
