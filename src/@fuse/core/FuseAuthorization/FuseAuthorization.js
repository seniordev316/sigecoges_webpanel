import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component } from 'react';
import { connect } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, userRole, login, history } = props;
    const { pathname } = location;

    const matched = matchRoutes(state.routes, pathname)[0];

    // console.log(login.success === false);
    // if (login.success === false) {
    //   history.push({
    //     pathname: '/login',
    //     state: { redirectUrl: pathname },
    //   });
    // }

    return {
      accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true,
    };
  }

  redirectRoute() {
    const { location, userRole, history, login } = this.props;
    const { pathname, state } = location;
    const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';
    console.log('FuseAuthorization', userRole, location, history, login);
    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      history.push({
        pathname: '/login',
        state: { redirectUrl: pathname },
      });
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */

      history.push({
        pathname: redirectUrl,
      });
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    // if (this.props.login.success === false && window.location.pathname !== '/login') {
    //   window.location.href = '/login';
    // }
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

function mapStateToProps({ auth }) {
  return {
    userRole: auth.user.role,
    login: auth.login,
  };
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
