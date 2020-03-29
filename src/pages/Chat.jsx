import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Feed, Segment, Form, Button, Header, Grid } from 'semantic-ui-react';

const URL = 'ws://localhost:3001/test/';
const ws = new WebSocket(URL);
class U_Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      events: [],
      loading: false
    };
  }

  inputChange = event => {
    this.setState({ message: event.target.value });
  };

  componentDidMount() {
    console.log('this.props.login', this.props.login);
    // if (this.props.login) {
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
      // this.ws.send('connected');
    };
    ws.onmessage = event => {
      // on receiving a message, add it to the list of messages
      console.log('event test', event.data);
      if (event.data) {
        const messages = JSON.parse(event.data);
        console.log('message in componentDidMount', messages);
        this.setState({
          events: messages,
          loading: false
        });
        // this.addMessage(messages);
      }
    };

    ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL);
    };
    // }
  }

  addMessage = message => {
    let newMsg = {
      username: 'toto',
      initiales: 'CP',
      message: message
      // date: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
    console.log('message in addMessage', newMsg);
    this.setState({ events: [...this.state.events, newMsg], loading: false });
  };

  onSubmit = event => {
    if (this.state.message !== '' && this.props.login) {
      event.preventDefault();
      console.log('this.state.message', this.state.message);
      console.log('document.cookie', document.cookie);
      let newSend = {
        message: this.state.message,
        cookie: document.cookie
      };
      ws.send(JSON.stringify(newSend));

      this.addMessage(this.state.message);
      this.setState({ message: '' });
    }
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <Segment loading={this.state.loading} style={{ height: '100%', with: '100%' }}>
        <Header as="h2" color="teal" textAlign="center">
          Messages
        </Header>
        {console.log('this.props.login in render', this.props.login)}
        <Segment style={{ overflow: 'auto', maxHeight: '460px' }}>
          <Feed>
            {this.state.events.map((event, index) => {
              // console.log('event', event);

              return (
                <Segment key={index}>
                  <Feed.Event>
                    {/* <Feed.Label>{event.intiales}</Feed.Label> */}
                    <Feed.Content>
                      <Feed.Summary>
                        <Feed.User>{event.username}</Feed.User>
                        {/* <Feed.Content>{event.message}</Feed.Content> */}
                        {' ' + event.message}
                        <Feed.Date>{event.date}</Feed.Date>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Segment>
              );
            })}
          </Feed>
        </Segment>
        <Form onSubmit={this.onSubmit} className="bottom">
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <Form.Input
                  fluid
                  icon="keyboard outline"
                  name="message"
                  iconPosition="left"
                  placeholder="your message"
                  value={this.state.message}
                  onChange={this.inputChange}
                  disabled={!this.props.login}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Button color="teal" fluid size="medium" disabled={!this.props.login}>
                  Send
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let Chat = connect(mapStateToProps)(U_Chat);
export default Chat;
