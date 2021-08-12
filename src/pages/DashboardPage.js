import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import { IconWidget, NumberWidget } from 'components/Widget';
import PoolSearchWizard from 'components/PoolSearchWizard';
import {
  teamPeekData,
} from 'demos/dashboardPage';
import Timer from "react-compound-timer";
import React from 'react';
import {
  FaTwitter,
  FaTelegram,
  FaMobile,
  FaMobileAlt,
  FaTelegramPlane
} from 'react-icons/fa';
import {
  Table,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText
} from 'reactstrap';
import googleAppStore from 'assets/img/google_plays.png';
import appAppStore from 'assets/img/apple_store.png';
import CircleLoader
  from "react-spinners/CircleLoader";
import { css } from "@emotion/core";
import { isEmpty } from 'utils/stringutil.js';
import ReactImageFallback from "react-image-fallback";
import CardanoImage from 'assets/img/cardanoIcon.png';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import SearchInput from 'components/SearchInput';
import { baseUrl, baseUrlPoolPeekService, dashboardData, recommendedPools, getPoolForRecommendedList, getPoolForSearchList } from '../assets/services';
import Favorite from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';

var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify); // optional
var linkifyHtml = require('linkifyjs/html');

const width = window.innerWidth;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

// const cardheaderStyle = {
//   borderBottom: 'solid 1px green',
//   borderTop: 'solid 1px green',
//   borderRight: 'solid 1px green',
//   borderLeft: 'solid 1px green',
//   // background: 'green',
//   // color: 'white',
//   paddingBottom: 0
// };

// const cardBodyStyle = {
//   borderBottom: 'solid 1px green',
//   // borderTop: 'solid 1px green',
//   borderRight: 'solid 1px green',
//   borderLeft: 'solid 1px green',
//   // background: 'green',
//   // color: 'white',
//   paddingBottom: 0,
//   paddingTop: 5,
//   paddingLeft: 20,
//   paddingRight: 10
// };


function checkIsImageUrl(url) {
  if (isEmpty(url)) {
    return false;
  }
  if (url.startsWith("https") && (url.endsWith(".png") || url.endsWith(".jpeg"))) {
    return true;
  }
  return false;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class DashboardPage extends React.Component {


  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
    loading: true,
    pools: null,
    liveStake: '',
    totalWalletsStaked: '',
    totalAdaSupply: '',
    modalImageWidth: 450,
    percentageOfSupplyStaked: 0,
    allpools: null,
    favouritepools: [],
    epochSecondsRemaining: 0,
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  async componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    this.getFavouritePools();
    this.generateEpochEvents();

    if (width < 600) {
      this.setState({ modal: true, modalImageWidth: width / 1.2 });
    }

    this.teamPeekData = teamPeekData;//shuffle(teamPeekData);

    await this.getDashboardData();

  }

  async getDashboardData() {
    this.getDashboardStatsData();
    await this.getAllPools();
    await this.getPoolList();
    this.setState({
      loading: false
    });
  }

  generateEpochEvents() {
    var epochDate = new Date(2017, 8, 23, 21, 44, 59);
    var today = new Date(new Date().toUTCString());
    var endDate = new Date(today.getFullYear(), 12, 31, 21, 45);

    var epoch = 0;
    var epochLength = 5;

    while (epochDate.getTime() < endDate.getTime()) {
      var epochEndDate = new Date(epochDate);
      epochEndDate.setDate(epochEndDate.getDate() + epochLength);

      if (today > epochDate && today < epochEndDate) {
        var timeInEpoch = epochEndDate.getTime() - new Date(Date.now() + (new Date().getTimezoneOffset() * 60000)).getTime();
        this.state.epochSecondsRemaining = timeInEpoch;


      }
      epoch++;
      epochDate = new Date(epochEndDate);
    }
  }

  async getAllPools() {
    var response = await fetch(baseUrlPoolPeekService + getPoolForSearchList);
    var data = await response.json();
    //console.log(data);
    this.setState({ allpools: data.pools });
  }

  async getPoolList() {
    var response = await fetch(baseUrlPoolPeekService + getPoolForRecommendedList);
    var data = await response.json();
    //console.log(data);
    this.setState({ pools: data.pools });
  }

  async getDashboardStatsData() {
    var response = await fetch(baseUrl + dashboardData);
    const data = await response.json();
    //console.log(data);

    this.setState({ liveStake: data.liveStake, totalWalletsStaked: data.totalWalletsStaked, totalAdaSupply: data.totalAdaSupply,
    totalPools: data.totalPools, averageStakePerPool: data.averageStakePerPool });
    this.state.liveStake = data.liveStake;
    this.state.totalAdaSupply = data.totalAdaSupply;

    var adaSupply = parseFloat(data.liveStake.replace(/,/g, ''));
    var liveStake = parseFloat(data.totalAdaSupply.replace(/,/g, ''));
    var percentage = ((adaSupply / liveStake) * 100).toFixed(2)
    this.setState({
      percentageOfSupplyStaked: percentage
    });
  }


  isLoading() {
    if (this.state.loading || this.state.allpools == null || this.state.pools == null) {
      return true;
    }
    else {
      return false;
    }
  }

  startWizard() {
    console.log("started");
  }

  getFavouritePools() {
    var storage = localStorage.getItem('favouritepools');
    if (storage != null) {
      var obj = JSON.parse(storage);

      this.setState({ favouritepools: obj.favouritepools });
    }
  }

  render() {
    return (
      <Page
        className="DashboardPage"
      // title="Dashboard"
      // breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='primary'>
              <CardBody>
                <CardTitle className="text-capitalize">
                  {this.state.totalPools}
                </CardTitle>
                <CardText>
                  Stake Pools
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='secondary'>
              <CardBody>
                <CardTitle className="text-capitalize">
                  {this.state.totalAdaSupply}
                </CardTitle>
                <CardText>
                  ADA Supply
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='primary'>
              <CardBody>
                <CardTitle className="text-capitalize">
                  {this.state.totalWalletsStaked}
                </CardTitle>
                <CardText>
                  Staked Wallets
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='secondary'>
              <CardBody>
                <CardTitle className="text-capitalize">
                  {this.state.liveStake}
                </CardTitle>
                <CardText>
                  ADA Staked
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='primary'>
              <CardBody body>
                <CardTitle className="text-capitalize">
                  {this.state.percentageOfSupplyStaked}
                </CardTitle>
                <CardText>
                  % Of ADA Supply Staked
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
            <Card inverse color='secondary'>
              <CardBody>
                <CardTitle className="text-capitalize">
                  {this.state.averageStakePerPool}
                </CardTitle>
                <CardText>
                  Average Stake Per Pool
                </CardText>
              </CardBody>
            </Card>
          </Col>

        </Row>

        <Row>
          <Col >
            <a href="https://twitter.com/CardanoPoolPeek" target="_blank" rel="noreferrer">
              <IconWidget
                bgColor="white"
                inverse={false}
                icon={FaTwitter}
                title="Follow Our Twitter"
                subtitle=""
              />
            </a>
          </Col>

          <Col >
            <IconWidget
              bgColor="white"
              inverse={false}
              icon={FaMobileAlt}
              title="Download Mobile APP"
              subtitle=""
              onClick={this.toggle()}
            />
          </Col>

          <Col >
            <a href="https://t.me/poolpeek" target="_blank" rel="noreferrer"> <IconWidget
              bgColor="white"
              inverse={false}
              icon={FaTelegram}
              title="Join Our Telegram"
              subtitle=""
            /></a>
          </Col>

          <Col >
            <a href="http://t.me/poolpeek_bot" target="_blank" rel="noreferrer"> <IconWidget
              bgColor="white"
              inverse={false}
              icon={FaTelegramPlane}
              title="Staking Rewards Bot"
              subtitle=""
            /></a>
          </Col>
        </Row>

        {/* <Modal
          isOpen={this.state.modal}
          toggle={false}
        >
          <ModalHeader toggle={this.toggle()}>Poolpeek Mobile</ModalHeader>
          <ModalBody>
            <Row>
              <p>Welcome - if you are viewing poolpeek using a mobile device you can download our App from the links below. </p>
              <Col>
                <a href="https://play.google.com/store/apps/details?id=com.colorworkapps.poolPeek" target="_blank" rel="noreferrer">
                  <img src={googleAppStore} width={this.state.modalImageWidth} alt='' /></a>
              </Col>
              <Col></Col>
              <Col>
                <a href="https://apps.apple.com/us/app/poolPeek/id1558648735" target="_blank" rel="noreferrer">
                  <img src={appAppStore} width={this.state.modalImageWidth} alt='' /></a>
              </Col>
            </Row>

          </ModalBody>
          <ModalFooter>
            {' '}
            <Button color="secondary" onClick={this.toggle()}>
              Close
            </Button>
          </ModalFooter>
        </Modal> */}
        {this.isLoading() ? <div><CircleLoader color={'#45b649'} loading={this.state.loading} css={override} size={180} /></div>
          :
          <Row>
            <Col lg={3} md={12} sm={12} xs={12} className="mb-3">

              <Card>
                <CardHeader >
                  <p><h6><b>Favourite Pools</b></h6></p><small>Click the favourite icon  on pools.</small>
                  <Favorite style={{ color: red }}></Favorite>
                </CardHeader>
                <CardBody body style={{minHeight: 345}}>
                  <Row>
                    <Col>
                  {this.state.favouritepools.map(function (item, index) {

                    return (
                      <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                        <Link to={`/pool/${item.pool_id}`}>
                          <h6>
                            {checkIsImageUrl(item.url_png_logo) ? (
                              <ReactImageFallback
                                src={item.url_png_logo}
                                width="60"
                                height="60"
                                fallbackImage={CardanoImage} />
                            ) : (<img
                              src={CardanoImage}
                              className="pr-2"
                              width="38"
                              height="32"
                            />)}
                            <b>&nbsp;{item.name}</b>
                          </h6>

                          {/* <p>{item.description}</p> */}
                        </Link>
                      </div>
                    )

                  })
                  }
                  </Col>
                  </Row>
                </CardBody>
              </Card>





            </Col>
            <Col lg={5} md={12} sm={12} xs={12} className="mb-3">
              {/* <PoolSearchWizard />
               */}

              <Timer
                initialTime={this.state.epochSecondsRemaining}
                direction="backward"
              >
                <Card>
                <CardHeader><h6><b>Next Cardano Epoch starts in:</b></h6></CardHeader>
                <CardBody body>
                  <div className="container-fluid" style={{ width: "100%" }}>

                    {/* <h6><b>Next Cardano Epoch starts in:</b></h6> */}
                    <Table {...{ ['striped']: true }}>
                      <thead>
                        <tr>
                          <th>Days</th>
                          <th>Hours</th>
                          <th>Minutes</th>
                          <th>Seconds</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><Timer.Days /></td>
                          <td><Timer.Hours /></td>
                          <td><Timer.Minutes /></td>
                          <td><Timer.Seconds /></td>
                        </tr>
                      </tbody>
                    </Table>

                  </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader><h6><b>Team Peek</b></h6><small>Support PoolPeek by staking with us.</small></CardHeader>
                  <CardBody body>

                    {teamPeekData.map(
                      ({ id, image, title, description, poolid, imgWidth, imgHeight, right }) => (
                        //https://poolpeek.com/pool/be7e2461a584b6532c972edca711fa466d7d0e8a86b6629fc0784ff6

                        <div style={{ display: 'inline-block', paddingRight: '10px' }}>
                          <Link to={`/pool/${poolid}`}>
                            <h6>
                              <ReactImageFallback
                                src={image}
                                width={imgWidth}
                                height={imgHeight}
                                fallbackImage={null} />
                              <b>&nbsp;{title}</b>
                            </h6>
                            {/* <p>{item.description}</p> */}
                          </Link>
                        </div>

                      ),
                    )}

                  </CardBody>
                </Card>
              </Timer>
            </Col>
            <Col lg={4} md={12} sm={12} xs={12} className="mb-3">
              <Card>
                <CardHeader><h6><b>Random Quality Pools</b></h6><small>A randomising list of pools we recommend!</small></CardHeader>
                <CardBody body style={{minHeight: 350}}>

                  {this.state.pools.map(function (item, index) {
                    if (index <= 2) {
                      return (
                        <Row style={{ display: 'inline-block' }}>
                          {/* <a href={`https://poolpeek.com/#/pool/${item.pool_id}`} target="_blank" rel="noreferrer"> */}
                          <Link to={`/pool/${item.pool_id}`}>
                            <h6>
                              {checkIsImageUrl(item.extended_meta.url_png_logo) ? (
                                <ReactImageFallback
                                  src={item.extended_meta.url_png_logo}
                                  width="40"
                                  height="40"
                                  fallbackImage={CardanoImage} />
                              ) : (<img
                                src={CardanoImage}
                                className="pr-2"
                                width="38"
                                height="32"
                              />)}
                              <b>&nbsp;{ReactHtmlParser(item.name)}</b>
                            </h6>

                            <p>{ReactHtmlParser(linkifyHtml(item.description, {
                              defaultProtocol: 'https'
                            }))}</p>
                          </Link>
                        </Row>
                      )
                    }
                  })
                  }
                </CardBody>
              </Card>
            </Col>

          </Row>
        }
      </Page >
    );
  }
}
export default DashboardPage;