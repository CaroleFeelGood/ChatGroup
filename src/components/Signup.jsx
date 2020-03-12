import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Header, Grid, Form, Segment } from 'semantic-ui-react';

class U_Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: ''
    };
  }
  inputChange = e => {
    let stateUpdate = {};
    stateUpdate[e.target.name] = e.target.value;
    this.setState(stateUpdate);
  };

  submitSignup = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append('username', this.state.username);
    data.append('password', this.state.password);
    data.append('firstname', this.state.firstname);
    data.append('lastname', this.state.lastname);
    let response = await fetch('/signup', {
      method: 'POST',
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert('user already exist');
      return;
    }
    this.props.dispatch({
      type: 'login-success',
      initiales: body.initials
    });
  };

  render() {
    return (
      <Grid textAlign="center" style={{ height: '60vh' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 250 }}>
          <Header as="h2" color="teal" textAlign="center">
            Signup
          </Header>
          <Segment stacked>
            <Form size="large" onSubmit={this.submitSignup}>
              <Form.Input
                fluid
                icon="user"
                required
                name="username"
                iconPosition="left"
                placeholder="E-mail address for login"
                value={this.state.username}
                onChange={this.inputChange}
              />
              <Form.Input
                fluid
                icon="user"
                required
                name="firstname"
                iconPosition="left"
                placeholder="firstname"
                value={this.state.firstname}
                onChange={this.inputChange}
              />
              <Form.Input
                fluid
                icon="user"
                required
                name="lastname"
                iconPosition="left"
                placeholder="lastname"
                value={this.state.lastname}
                onChange={this.inputChange}
              />
              <Form.Input
                fluid
                icon="lock"
                required
                name="password"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={this.state.password}
                onChange={this.inputChange}
              />
              <Button color="teal" fluid size="large">
                Signup
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
let Signup = connect(mapStateToProps)(U_Signup);
export default Signup;
