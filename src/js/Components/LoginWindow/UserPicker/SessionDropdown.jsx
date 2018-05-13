// SessionDropdown -> Required by Components/UserPanel/Form
// --------------------------------------
// Displays session rows as a dropdown to handle
// session switching.

import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

import SessionRow from './SessionRow';


export class SessionDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state({
      'dropdownActive': false
    });
  }


  handleClick(sessionKey) {
    return (e) => {
      if (sessionKey === this.props.activeSession.key) {
        this.setState({
          'dropdownActive': true
        });
      } else {
        this.props.setActiveSession(sessionKey);

        this.setState({
          'dropdownActive': false
        });
      }
    };
  }


  handleDropdownLeave() {
    this.setState({
      'dropdownActive': false
    });
  }


  render() {
    // Sort by active, then alphabetical.
    // Doing this requires using sort in reverse.
    let rows = (
      window.lightdm.sessions
        .sort((a, b) => {
          return a.name.toUpperCase() > b.name.toUpperCase();
        })
        .sort((a, b) => {
          return (b.key.toLowerCase() === this.props.activeSession.key.toLowerCase()) ? 1 : -1;
        })
        .map((session) => (
          <SessionRow
            active={ (this.props.activeSession.key === session.key) }
            key={ session.key }
            session={ session }
            buttonColor={ this.props.buttonColor }
            handleClick={ this.handleClick(session.key).bind(this) }
          />
        ))
    );

    let classes = ['dropdown', 'user-session'];

    if (this.state.dropdownActive === true) {
      classes.push('active');
    }

    return (
      <div className={ classes.join(' ') } onMouseLeave={ this.handleDropdownLeave.bind(this) }>
        { rows }
      </div>
    );
  }
}

SessionDropdown.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'setActiveSession': PropTypes.func.isRequired,
  'buttonColor': PropTypes.string.isRequired
};


export default connect(
  (state) => {
    return {
      'activeSession': state.session,
      'buttonColor': state.settings.style_login_button_color
    };
  },
  null
)(SessionDropdown);
