import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Feed, Icon, Segment, Button, Header } from 'semantic-ui-react';

const URL = 'ws://localhost:3001/chat/';
const ws = new WebSocket(URL);

class U_Members extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  logOut = async () => {
    let response = await fetch('/logout');
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert('error in logout');
      return;
    }
    let logout = {
      type: 'userevent'
      // cookie: document.cookie
    };
    ws.send(JSON.stringify(logout));
    this.props.dispatch({
      type: 'logout',
      initiales: body.initials
    });
  };

  componentDidMount() {
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };
    ws.onmessage = event => {
      // on receiving a message, add it to the list of messages
      console.log('event test in members', event.data);
      if (event.data) {
        const messages = JSON.parse(event.data);
        if (messages.type === 'userevent') {
          this.setState({ users: messages.data });
        }
      }
    };

    ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL);
    };
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <Segment style={{ height: '100%' }}>
        <Header as="h2" color="teal" textAlign="center">
          Members Online
        </Header>
        <Segment>
          <Feed>
            {this.state.users.map((userToElement, index) => {
              return (
                <Feed.Event key={index}>
                  <Feed.Content>{userToElement}</Feed.Content>
                  <Feed.Label>
                    <Icon name="comment" color="teal" size="mini" />
                  </Feed.Label>
                </Feed.Event>
              );
            })}
          </Feed>
        </Segment>
        <Button color="teal" fluid size="large" onClick={this.logOut} className="bottom Logoff">
          Logout
        </Button>
      </Segment>
    );
  }
}

let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let Members = connect(mapStateToProps)(U_Members);
export default Members;
