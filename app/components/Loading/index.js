/**
 *
 * Loading
 *
 */

import React from 'react';
import { Spin } from 'antd';
import 'antd/dist/antd.css';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spin size="large" />
    </div>
  );
}

Loading.propTypes = {};

export default Loading;
