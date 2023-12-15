/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Col, Input, Row, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import withAuthentication from 'utils/withAuthentication';
import TopNav from 'components/TopNav';
import Loading from 'components/Loading';
import axios from 'axios';
import { getToken } from 'utils/authHelper';
import { debounce, get } from 'lodash';
import messages from './messages';

const { Search } = Input;

function HomePage({ history }) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({
    searchText: '',
    filter: {
      email: '',
      firstName: '',
      lastName: '',
      industry: '',
    },
    options: {
      sortBy: 'asc',
      limit: 10,
      page: 1,
    },
  });
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    debugger;
    const value = get(event, 'target.value');
    setSearchTerm(value);
    setQuery(state => ({ ...state, searchText: value }));
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  useEffect(() => {
    const token = getToken();

    // Simulate an async data loading operation
    const loadData = async () => {
      const res = await axios.post('/api/search', { query, token });
      setExperts(res.data);
      debugger;
      setLoading(false);
    };

    loadData();
  }, []);
  useEffect(() => {
    const loadData = async (query, token) => {
      const res = await axios.post('/api/search', { query, token });
      setExperts(res.data);
      debugger;
      setLoading(false);
    };
    if (searchTerm && query) {
      // Fetch data based on searchTerm
      console.log('Fetching data for:', searchTerm);
      const token = getToken();
      loadData(query, token);
    }
  }, [query]);

  const handleProfileClick = id => {
    history.push(`/profile/${id}`);
  };
  const cards = Array(10).fill(null);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <TopNav />
          <div style={{ padding: '2rem' }}>
            <Row style={{ marginBottom: '1rem' }}>
              <Col span={24}>
                <Search
                  placeholder="Search"
                  enterButton
                  style={{ marginBottom: '1rem' }}
                  // onSearch={debouncedHandleSearch}
                  onChange={debouncedHandleSearch}
                />
              </Col>
            </Row>
            {/* Add your filter component here */}
            <Row gutter={[16, 16]}>
              <Row style={{ marginLeft: '5px' }}>
                <h1>Total Count: {experts.length}</h1>
              </Row>
              {experts.map(({ id, firstName, lastName, industry }, index) => (
                <Col xs={24} sm={24} md={24} lg={24} key={id}>
                  <Card
                    title={
                      (firstName + lastName).length
                        ? `${firstName}  ${lastName}`
                        : `Expert ${index + 1}`
                    }
                    extra={
                      <Button
                        type="primary"
                        onClick={() => handleProfileClick(id)}
                      >
                        View Profile
                      </Button>
                    }
                  >
                    {/* Add card content here */}
                    <p>Industry: {industry || 'Software Development'}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </>
  );
}

export default withRouter(withAuthentication(HomePage));
