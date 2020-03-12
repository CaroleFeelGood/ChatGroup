import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

class U_Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  inputChange = e => {
    let stateUpdate = {};
    stateUpdate[e.target.name] = e.target.value;
    this.setState(stateUpdate);
  };

  submitlogin = async event => {
    if (this.state.username !== '') {
      event.preventDefault();
      let data = new FormData();
      data.append('username', this.state.username);
      data.append('password', this.state.password);
      let response = await fetch('/login', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
      let responseBody = await response.text();
      let body = JSON.parse(responseBody);
      if (!body.success) {
        alert('login failed');
        return;
      }
      this.props.dispatch({
        type: 'login-success',
        initiales: body.initials
      });
    }
  };

  render() {
    return (
      <Grid textAlign="center" style={{ height: '60vh' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 250 }}>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Segment stacked>
            <Form size="large" onSubmit={this.submitlogin}>
              <Form.Input
                fluid
                icon="user"
                required
                iconPosition="left"
                placeholder="E-mail address"
                name="username"
                value={this.state.username}
                onChange={this.inputChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.inputChange}
              />
              <Button color="teal" fluid size="large">
                Login
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let Login = connect(mapStateToProps)(U_Login);
export default Login;
