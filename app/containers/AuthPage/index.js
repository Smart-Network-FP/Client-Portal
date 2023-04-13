/**
 *
 * AuthPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Card, Form, Input, message, Tabs } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { pick } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { saveToken } from 'utils/authHelper';
import makeSelectAuthPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Logo from './logo.jpeg';

const { TabPane } = Tabs;

const AuthPage = Form.create()(({ form, history }) => {
  useInjectReducer({ key: 'authPage', reducer });
  useInjectSaga({ key: 'authPage', saga });
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async values => {
    try {
      const response = await axios.post('/api/login', values); // Replace with your login API URL
      saveToken(response.data.tokens.access.token);
      history.push('/home');
    } catch (error) {
      message.error('Invalid username or password');
    }
  };

  const handleSignUp = async values => {
    debugger;
    try {
      const response = await axios.post(
        '/api/signup',
        pick(values, ['email', 'password', 'name']),
      ); // Replace with your signup API URL
      saveToken(response.data.tokens.access.token);
      history.push('/home');
    } catch (error) {
      message.error('Failed to sign up');
    }
  };

  const onFinish = (err, values) => {
    if (!err) {
      if (activeTab === 'login') {
        handleLogin(values);
      } else {
        handleSignUp(values);
      }
    }
  };

  const onTabChange = key => {
    setActiveTab(key);
    resetFields();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login or Signup" />
      </Helmet>
      <Card style={{ width: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        <Tabs activeKey={activeTab} onChange={onTabChange}>
          <TabPane tab="Login" key="login">
            <Form
              layout="vertical"
              onSubmit={e => {
                e.preventDefault();
                validateFieldsAndScroll(['email', 'password'], onFinish);
              }}
              autoComplete="off"
            >
              <Form.Item label="Email">
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input your email!' },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please input your password!' },
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Sign Up" key="signup">
            <Form
              layout="vertical"
              onSubmit={e => {
                e.preventDefault();
                validateFieldsAndScroll(onFinish);
              }}
              autoComplete="off"
            >
              <Form.Item label="Username">
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: 'Please input your username!' },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Email">
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input your username!' },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please input your password!' },
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item label="Confirm Password">
                {getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value && value !== form.getFieldValue('password')) {
                          callback('The two passwords do not match!');
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
});

AuthPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  authPage: makeSelectAuthPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(AuthPage);
