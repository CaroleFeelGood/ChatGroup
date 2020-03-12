import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Feed, Icon, Segment, Button, Header } from 'semantic-ui-react';

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
    this.props.dispatch({
      type: 'logout',
      initiales: body.initials
    });
  };

  componentDidMount() {
    let updateUserActive = async () => {
      let response = await fetch('/useronline');
      if (this.isUnmounted) {
        return;
      }
      let responseBody = await response.text();
      let body = JSON.parse(responseBody);
      this.setState({ users: body });
    };
    setInterval(updateUserActive, 5000);
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
