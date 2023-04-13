import React from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from './authHelper';

const withAuthentication = WrappedComponent => props => {
  if (isAuthenticated()) {
    return <WrappedComponent {...props} />;
  }
  return <Redirect to="/" />;
};

export default withAuthentication;
