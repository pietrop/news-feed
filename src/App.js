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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

let Parser = require('rss-parser');
// longer list of feeds
// https://blog.feedspot.com/uk_news_rss_feeds/
const VOX_RSS = 'https://vox.com/rss/index.xml';
const BBC_RSS = 'http://feeds.bbci.co.uk/news/rss.xml';
const BBC_TECHNOLOGY_RSS = 'http://feeds.bbci.co.uk/news/video_and_audio/technology/rss.xml'
const BBC_SCIENCE_AND_ENVIROMENT_RSS = 'http://feeds.bbci.co.uk/news/video_and_audio/science_and_environment/rss.xml';
const GUARDIAN_WORLD_RSS ='https://www.theguardian.com/world/rss';
const GUARDIAN_TOP_RSS = 'https://www.theguardian.com/uk/rss';
const WSJ_WORLD_RSS= 'https://feeds.a.dj.com/rss/RSSWorldNews.xml';
const WSJ_TECHNOLOGY_RSS = 'https://feeds.a.dj.com/rss/RSSWSJD.xml';
const NEWS_UK_RSS = 'https://www.news.co.uk/feed';
const BUZZFEED_US_NEWS_RSS = 'https://www.buzzfeed.com/usnews.xml';
const QUARTZ_RSS = 'https://qz.com/re/rss';

const RSS_FEEDS = [
  { 
    value: VOX_RSS, 
    label: 'Vox'
  }, 
  { 
    value: BBC_RSS, 
    label: 'BBC'
  },
  { 
    value: BBC_TECHNOLOGY_RSS, 
    label: 'BBC - Technology'
  },
  { 
    value: BBC_SCIENCE_AND_ENVIROMENT_RSS, 
    label: 'BBC - Science And Enviroment'
  },
  { 
    value: GUARDIAN_WORLD_RSS, 
    label: 'Guardian - World'
  },
  { 
    value: GUARDIAN_TOP_RSS, 
    label: 'Guardian - Top'
  },
  {
    value: WSJ_WORLD_RSS,
    label: 'WSJ - World'
  },
  {
    value: WSJ_TECHNOLOGY_RSS,
    label: 'WSJ - Technology'
  },
  {
    value: NEWS_UK_RSS,
    label: 'News - UK'
  },
  {
    value: BUZZFEED_US_NEWS_RSS,
    label: 'Buzz Feed - US News'
  },
  {
    value: QUARTZ_RSS,
    label: 'Quartz'
  }
]

let parser = new Parser();
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      feedItems: [],
      options: RSS_FEEDS
     };
  }

  async componentDidMount(){
    RSS_FEEDS.forEach( async (rssFeed)=>{
      let feed = await parser.parseURL(CORS_PROXY + rssFeed.value);
      const { feedItems } = this.state;
      const newFeedItems = feed.items.map((item)=>{ item.display = true; item.brand = feed.title; return item;});
      const updatedFeedItems = feedItems.concat(newFeedItems);
      this.setState({
        feedItems: updatedFeedItems, 
        feedTitle: feed.title
      })
    })
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

  // filterRssFeed = (brandValue)=>{
  //   const rssFeedResults = this.state.feedItems.map((item) => {
  //     if (item.brand.toLowerCase().includes(brandValue.toLowerCase())) {
  //       item.display = true;

  //       return item;
  //     } else {
  //       item.display = false;

  //       return item;
  //     }
  //   });

  //   this.setState({
  //     images: rssFeedResults
  //   });
  // }

  // handleSelectChange = selectedOption => {
  //   console.log(`Option selected:`, selectedOption)
  //   if(selectedOption){
  //     this.setState({ selectedOption });
  //     this.filterRssFeed(selectedOption[0].label);
  //   }
  // };

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
        {/* <Card.Header>{this.state.feedTitle}</Card.Header> */}
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
        {/* <Card.Header>
            <Select
            isClearable
            isMulti
            value={this.state.selectedOption? this.state.selectedOption : '' }
            onChange={this.handleSelectChange}
            options={this.state.options}
          />
        </Card.Header> */}
        <ListGroup variant="flush" style={{ height: '90vh',overflow: 'auto'}}>
        {/* <ListGroup> */}
        {feed}
        {/* </ListGroup> */}
        </ListGroup>
        </Card>
      </Container>
      ); 
  }
}

export default App;
