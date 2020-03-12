import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import MenuTop from './components/MenuTop';
import Wall from './pages/Wall';

class U_App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let checkCookie = async () => {
      let response = await fetch('/checklogin');
      let responseBody = await response.text();
      let body = JSON.parse(responseBody);
      if (body.success) {
        this.props.dispatch({
          type: 'login-success',
          initiales: body.initials
        });
      }
    };
    checkCookie();
  }

  render() {
    return (
      <div className="global-container">
        <BrowserRouter>
          <MenuTop />
          <Wall />
        </BrowserRouter>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let App = connect(mapStateToProps)(U_App);
export default App;
