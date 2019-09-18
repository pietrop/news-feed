import React from 'react';
import './App.css';
import 'bootstrap-css-only/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import getDataFromFeed from './load-data/index.js';

const RSS_FEEDS = require('./load-data/RSS_FEEDS.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      feedItems: []
     };
  }

  async componentDidMount(){
    const self = this;
    const rssFeedData = Promise.resolve(getDataFromFeed(RSS_FEEDS));
    rssFeedData.then(function(data) {
      self.setState({
        feedItems: data, 
        feedTitle: 'feed.title'
      })
    }, function(e) {
      console.error(e); 
    });
  }

  handleSearch = (e)=>{
    this.searchRssFeed(e.target.value);
  }

  searchRssFeed = (searchValue)=>{
    const rssFeedResults = this.state.feedItems.map((item) => {
      if (item.title.toLowerCase().includes(searchValue.toLowerCase())
      || item.contentSnippet.toLowerCase().includes(searchValue.toLowerCase())) {
        item.display = true;

        return item;
      } else {
        item.display = false;

        return item;
      }
    });

    this.setState({
      images: rssFeedResults
    });
  }

  render() {
    const feed = this.state.feedItems.map((item,index)=>{
      if (item.display) {
      return (
        <ListGroup.Item key={item.link+index}>
          <Row>
            <Col xl={9} lg={9} md={9} sm={9}  xs={12}>
              <details>
                <summary title={item.pubDate}>
                  <a href= {item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                </summary>
                <div dangerouslySetInnerHTML={{__html: item.content}}/>
                <small className={'text-secondary'}>{item.author}</small>
              </details>
            </Col>
            <Col xl={3} lg={3} md={3} sm={3}  xs={12}>
              <Badge className={'noselect'} variant="dark">{item.brand}</Badge>
            </Col>
          </Row>
        </ListGroup.Item>
       )
      }
      else {
        return null;
      }
    })
    return (
      <Container>
        <Card>
        <Card.Header>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <FontAwesomeIcon icon={ faSearch } />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search news feeds.."
              aria-label="search"
              aria-describedby="basic-addon1"
              onChange={this.handleSearch}
            />
          </InputGroup>
        </Card.Header>
        <ListGroup variant="flush" style={{ height: '90vh',overflow: 'auto'}}>
        {feed}
        </ListGroup>
        </Card>
      </Container>
      ); 
  }
}

export default App;
