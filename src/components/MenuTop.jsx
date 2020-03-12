import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Menu, Button } from 'semantic-ui-react';
import { FaUserCircle } from 'react-icons/fa';
import Login from '../components/Login';
import Signup from '../components/Signup';

class U_MenuTop extends Component {
  // constructor(props) {
  //   super(props);
  // }
  openModalLogin = () => {
    this.props.dispatch({
      type: 'open-login'
    });
  };

  closeLogin = () => {
    this.props.dispatch({
      type: 'close-login'
    });
  };

  openModalSignup = () => {
    this.props.dispatch({
      type: 'open-signup'
    });
  };
  closeSignup = () => {
    this.props.dispatch({
      type: 'close-signup'
    });
  };

  getUserMenu = () => {
    let loginBtnImg = <FaUserCircle />; // SV
    if (this.props.login) {
      loginBtnImg = this.props.initiales;
      return <div className="roundBtn">{loginBtnImg}</div>;
    }
    return (
      <Menu className="userMenu">
        <Menu.Item>
          <Modal
            trigger={
              <Button color="teal" onClick={this.openModalLogin}>
                Log-in
              </Button>
            }
            open={this.props.openLogin}
            onClose={this.closeLogin}
          >
            <Modal.Content>
              <Login onClose={this.closeLogin} />
            </Modal.Content>
          </Modal>
        </Menu.Item>
        <Menu.Item>
          <Modal trigger={<Button onClick={this.openModalSignup}>Signup</Button>} open={this.props.openSignup} onClose={this.closeSignup}>
            <Modal.Content>
              <Signup onClose={this.closeSignup} />
            </Modal.Content>
          </Modal>
        </Menu.Item>
      </Menu>
    );
  };
  render() {
    let userMenu = this.getUserMenu();
    return (
      <div className="top-menu-container">
        <div></div>
        <div className="menuTopCenter">Wall's - Enjoy Chat</div>
        {userMenu}
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    login: state.loggedIn,
    openLogin: state.openLogin,
    openSignup: state.openSignup,
    initiales: state.initiales
  };
};
let MenuTop = connect(mapStateToProps)(U_MenuTop);
export default MenuTop;
