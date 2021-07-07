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
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import getDataFromFeed from './load-data/index.js';

/**
 *  https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
 * 
htmlDecode("&lt;img src='myimage.jpg'&gt;"); 
// returns "<img src='myimage.jpg'>"
 */
function htmlDecode(input) {
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
}

// const CORS_PROXY = 'https://api.allorigins.win/get?url='; /

const RSS_FEEDS = require('./load-data/RSS_FEEDS.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedItems: [],
    };
  }

  async componentDidMount() {
    const finalRes = RSS_FEEDS.map((rss) => {
      return fetch(rss.value)
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then((data) => {
          // console.log(data);
          const icon = data.querySelector('icon').innerHTML;
          // console.log(icon);
          const title = data.querySelector('title').innerHTML;
          // console.log(title);
          const updated = data.querySelector('updated').innerHTML;
          // console.log(updated);
          const link = data.querySelector('link').getAttribute('href');
          // console.log(link);
          const publication = { title, icon, updated, link };
          const entries = data.querySelectorAll('entry');
          // console.log('entries', entries);
          const parsedEntries = [...entries].map((el) => {
            const title = el.querySelector('title').innerHTML;
            // console.log(title);
            const link = el.querySelector('link').getAttribute('href');
            // console.log(link);
            const published = el.querySelector('published').innerHTML;
            // console.log(published);
            const updated = el.querySelector('updated').innerHTML;
            // console.log(updated);
            const content = el.querySelector('content').innerHTML;
            // console.log(content);
            const authorName = el.querySelector('name').innerHTML;
            // console.log(authorName);
            return {
              publication,
              title,
              link,
              published,
              updated,
              content,
              authorName,
            };
          });
          console.log('parsedEntries', parsedEntries);
          // const result = { icon, title, updated, link, entries: parsedEntries };
          return parsedEntries;
          // return result;
        });
    });
    const rs = await Promise.all(finalRes);
    console.log('finalRes  ', rs.flat());
    const rsFlat = rs.flat();
    console.log('rsFat', rsFlat);
    // console.log('finalRes.flat()', finalRes.flat());
    this.setState({
      feedItems: rsFlat,
      feedTitle: 'title',
    });

    // const self = this;
    // const rssFeedData = Promise.resolve(getDataFromFeed(RSS_FEEDS));
    // rssFeedData.then(
    //   function (data) {
    //     self.setState({
    //       feedItems: data,
    //       feedTitle: 'feed.title',
    //     });
    //   },
    //   function (e) {
    //     console.error(e);
    //   }
    // );
  }

  handleSearch = (e) => {
    this.searchRssFeed(e.target.value);
  };

  searchRssFeed = (searchValue) => {
    console.log('this.state.feedItems', this.state.feedItems);
    const rssFeedResults = this.state.feedItems.map((item) => {
      if (
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.content.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        item.display = true;

        return item;
      } else {
        item.display = false;

        return item;
      }
    });

    this.setState({
      images: rssFeedResults,
    });
  };

  render() {
    const feed = this.state.feedItems.map((item, index) => {
      if (item.display) {
        return (
          <ListGroup.Item key={item.link + index}>
            <Row>
              <Col xl={9} lg={9} md={9} sm={9} xs={12}>
                <details>
                  <summary title={item.pubDate}>
                    <img
                      style={{ width: '20px', height: '20px' }}
                      src={item.publication.icon}
                    ></img>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </summary>
                  <div dangerouslySetInnerHTML={{ __html: htmlDecode(item.content) }} />
                  <small className={'text-secondary'}>{item.author}</small>
                </details>
              </Col>
              <Col xl={3} lg={3} md={3} sm={3} xs={12}>
                <Badge className={'noselect'} variant="dark">
                  {item.brand}
                </Badge>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      } else {
        return null;
      }
    });
    return (
      <Container>
        <Card>
          <Card.Header>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FontAwesomeIcon icon={faSearch} />
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
          <ListGroup variant="flush" style={{ height: '90vh', overflow: 'auto' }}>
            {feed}
          </ListGroup>
        </Card>
      </Container>
    );
  }
}

export default App;
