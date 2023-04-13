/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Col, Input, Row, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import withAuthentication from 'utils/withAuthentication';
import TopNav from 'components/TopNav';
import messages from './messages';

const { Search } = Input;

function HomePage({ history }) {
  const handleProfileClick = () => {
    history.push('/profile');
  };

  const cards = Array(10).fill(null);
  return (
    <div>
      <TopNav />
      <div style={{ padding: '2rem' }}>
        <Row style={{ marginBottom: '1rem' }}>
          <Col span={24}>
            <Search placeholder="Search" enterButton />
          </Col>
        </Row>
        {/* Add your filter component here */}
        <Row gutter={[16, 16]}>
          {cards.map((_, index) => (
            <Col xs={24} sm={24} md={24} lg={24} key={index}>
              <Card
                title={`Card ${index + 1}`}
                extra={
                  <Button type="primary" onClick={handleProfileClick}>
                    View Profile
                  </Button>
                }
              >
                {/* Add card content here */}
                <p>Card content</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default withRouter(withAuthentication(HomePage));
