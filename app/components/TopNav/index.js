/**
 *
 * TopNav
 *
 */

import React, { useState } from 'react';
import {
  Avatar,
  Col,
  Dropdown,
  Icon,
  Layout,
  Menu,
  Modal,
  Row,
  Form,
  Input,
  Upload,
  Button,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import { removeToken } from 'utils/authHelper';
import { v4 as uuidv4 } from 'uuid';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Logo from './logo.jpeg';
const { Header } = Layout;

const TopNav = Form.create()(({ form, history }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logging out...');
    removeToken();
    history.push('/');
  };

  const handleSettingsClick = () => {
    setSettingsVisible(true);
  };

  const handleSettingsCancel = () => {
    setSettingsVisible(false);
  };

  const handleAvatarClick = () => {
    // Implement navigation to user profile page if necessary
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'settings') {
      setSettingsVisible(true);
    }
  };
  const handleOk = () => {
    form.submit();
  };

  const onFinish = values => {
    console.log('Received values of form: ', values);
    setSettingsVisible(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="settings" icon={<EditOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Replace this with actual user data
  const userData = {
    username: 'John Doe',
    email: 'john.doe@example.com',
    image: null,
  };

  const avatar = userData.image ? (
    <img src={userData.image} alt={userData.username} />
  ) : (
    <Avatar style={{ backgroundColor: '#87d068' }}>
      {userData.username[0].toUpperCase()}
    </Avatar>
  );

  return (
    <Header>
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <div className="logo">
            {/* Implement your logo here */}
            {/* <h2>Logo</h2> */}
            <img
              src={Logo}
              alt="Logo"
              style={{
                height: '50px',
                width: 'auto',
                marginRight: '10px',
                verticalAlign: 'middle',
              }}
            />
          </div>
        </Col>
        <Col>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {avatar}
            </a>
          </Dropdown>
        </Col>
      </Row>
      <Modal
        title="Settings"
        visible={settingsVisible}
        onCancel={handleSettingsCancel}
        footer={null}
        onOk={handleOk}
      >
        <Form form={form} onSubmit={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label="Email"
            initialValue={userData.email}
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            initialValue={userData.username}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="upload" label="Upload Profile Image">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
});

TopNav.propTypes = {};

export default withRouter(TopNav);
