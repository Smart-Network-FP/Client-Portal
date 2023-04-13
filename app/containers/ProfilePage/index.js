/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Card, Col, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import withAuthentication from 'utils/withAuthentication';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function ProfilePage({ history }) {
  useInjectReducer({ key: 'profilePage', reducer });
  useInjectSaga({ key: 'profilePage', saga });

  const handleBackClick = () => {
    history.goBack();
  };

  const sections = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Row style={{ marginBottom: '1rem' }}>
        <Col span={24}>
          <Button onClick={handleBackClick}>Back to Home</Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {sections.map((section, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card title={section.title}>
              <p>{section.content}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

ProfilePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profilePage: makeSelectProfilePage(),
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
  withAuthentication,
  withConnect,
)(ProfilePage);
