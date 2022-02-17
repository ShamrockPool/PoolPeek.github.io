import Page from 'components/Page';
import React from 'react';
import {
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Table,
  Button
} from 'reactstrap';

import CircleLoader
  from "react-spinners/CircleLoader";
import { css } from "@emotion/core";
import { baseUrlPoolPeekService, getisopools } from '../assets/services';
import "../styles/styles.css";
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import JoinPool from 'components/nami/JoinPool';

import dd from 'assets/img/dripdropz.svg';
import ppc from 'assets/img/PKCoin2.m4v';

const cardano = window.cardano;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const width = window.innerWidth;

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});

const tableRowStyle = {
  // borderBottom: 'solid 3px blue',
  // background: 'green',
  // color: 'white',
  fontWeight: 'bold',
  // padding: 0,
};

const columns = [
  {
    field: 'name', flex: 1,
    renderHeader: (params) => (
      <h2>
        {'Name'}
      </h2>
    )
  },
  {
    field: 'ticker', flex: 1,
    renderHeader: (params) => (
      <h2>
        {'Ticker'}
      </h2>
    ),
  },
  {
    field: 'livestake', flex: 1,
    renderHeader: (params) => (
      <h2>
        {'Stake'}
      </h2>
    ),
  },
  {
    field: 'saturation', flex: 1, renderHeader: (params) => (
      <h2>
        {'Saturation'}
      </h2>
    ),
  },
];

class PoolPeekCoinPools extends React.Component {
  state = {
    pools: null,
    loading: true,
    totalPools: '',
    smallScreen: false,
    searched: "",
    filterAblepools: [],
    stats: null,
    walletConnected: false,
    namiEnabled: false,
  };

  async componentDidMount() {

    if (width < 600) {
      this.setState({ smallScreen: true });
    }

    try {
      var namiEnabled = await cardano.nami.isEnabled()
      this.setState({ namiEnabled: namiEnabled });
    } catch (error) {

    }

    this.getPools();

    try {
      var namiEnabled = await cardano.nami.isEnabled()
      this.setState({ namiEnabled: namiEnabled });
    } catch (error) {

    }



    window.scrollTo(0, 0);
  }

  async getPools() {
    try {
      var response = await fetch(baseUrlPoolPeekService + getisopools + 'poolpeekcoinpools');
      const data = await response.json();

      this.setState({ stats: data.poolDetailsSundaeStatsVO })
      this.createRows(data);
      //this.setState({ loading: false, filterAblePools: rows })
    } catch (error) {
      console.log(error)
    }
  }

  createRows(sundaeData) {
    var rows = [];

    var poolsList = [];
    poolsList = sundaeData.pools;
    this.setState({ loading: false, filterAblePools: poolsList })
  }

  handleRowClick(rowData) {
    var url = '/pool/' + rowData.pool_id;
    this.props.history.push(url);
  }

  addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  onSort(event, sortKey) {
    if (sortKey == 'name' || sortKey == 'ticker') {
      const data = this.state.filterAblePools;
      data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
      this.setState({ loading: false, filterAblePools: data })
    } else {
      const data = this.state.filterAblePools;
      data.sort((a, b) => Number(a[sortKey]) - (Number(b[sortKey])))
      this.setState({ loading: false, filterAblePools: data })
    }

  }



  render() {

    return (
      <Page
        className="PoolPeekCoinPools"
        title="PoolPeek Coin Pools"
      >
        {this.state.loading ? <div><CircleLoader color={'#45b649'} loading={this.state.loading} css={override} size={180} /></div>
          :


          <Col>

            <Row>
              <Col>
                <Row>
                  <h3>Starting Stats</h3>
                </Row>


                <Row>

                  <Col lg={4} md={12} sm={12} xs={12} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody body>
                        <CardTitle className="text-capitalize">
                          Pools
                        </CardTitle>
                        <CardText>
                          13
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={4} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='primary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Stake
                        </CardTitle>
                        <CardText>
                          {this.addCommas(Number(74877286))}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={4} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Delegates
                        </CardTitle>
                        <CardText>
                          {this.addCommas(1152)}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <h3>Live Stats</h3>
                </Row>


                <Row>

                  <Col lg={4} md={12} sm={12} xs={12} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody body>
                        <CardTitle className="text-capitalize">
                          Pools
                        </CardTitle>
                        <CardText>
                          {this.state.stats.total_pools}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={4} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='primary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Stake
                        </CardTitle>
                        <CardText>
                          {this.addCommas(this.state.stats.total_live_stake)}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={4} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Delegates
                        </CardTitle>
                        <CardText>
                          {this.addCommas(this.state.stats.live_stake_delegator_count)}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

              </Col>
            </Row>

            <Row>

              <Col style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>

                <p><b>To Earn PoolPeekCoins (PPC) stake your #ADA with any of the
                  below pools this will enable you to collect PPC tokens from:  <a href='https://dripdropz.io/' target="_blank" rel="noreferrer" >
                    <img
                      src={dd}
                      width="100"
                      height="60"
                    /></a></b></p>
              </Col>

            </Row>

            <Row style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <p>Token Policy ID: d0af056c509b6b1133cd83a750b7245e561169281fde3df1cb6e2d96</p></Row>
              <Row style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <p><b>Description:</b> PoolPeekCoin is a rewards coin that has been created as an incentive reward that will be given to loyal delegators of the #TeamPeek pool offering. </p>
              </Row>

              <Row style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <p><b>Tokenomics:</b> 21Million coins have been created. There is 10Million allocated to the DripDrops token distribution project with a further 5Million in reserve. There will be 3Million allocated to the three creator pools & 3Million allocated for future giveaways & incentive stuctures. </p>
              </Row>
            <Row>



              <Col style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>

                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>


                  {/* {width > 600 &&
                    <video loop autoPlay muted style={{ width: "6vw" }}>
                      <source src={ppc} type='video/mp4' />
                    </video>} */}

                  <a href='https://discord.gg/nzSR3rFkef' target="_blank" rel="noreferrer" >
                    <p>PoolPeek Discord</p> <FontAwesomeIcon size="2x" icon={faDiscord} /> </a>

                  {/* {width > 600 &&
                  <img
                    src={dd}
                    width="200"
                    height="120"
                  />} */}

                </Row>


              </Col>

              <Col lg={12} md={12} sm={12} xs={12} className="mb-3">

                <Card>
                  <CardBody body style={{
                    padding: '5px', margin: '0px',
                  }}>
                    <CardTitle className="text-capitalize">
                      <b>Pools</b>
                    </CardTitle>
                    <small>Table ordered by filled %.</small>

                    {this.state.smallScreen == false ?
                      <Table {...{ ['striped']: true }}>
                        <thead>
                          <tr>
                            <th onClick={e => this.onSort(e, 'name')}>Name</th>
                            <th onClick={e => this.onSort(e, 'ticker')}>Ticker</th>
                            <th onClick={e => this.onSort(e, 'margin_pct')}>Margin</th>
                            {/* <th onClick={e => this.onSort(e, 'cost_per_epoch')}>Fixed Cost</th> */}
                            <th onClick={e => this.onSort(e, 'live_stake_delegator_count')}>Delegates</th>
                            <th onClick={e => this.onSort(e, 'live_stake')}>Live Stake</th>
                            <th onClick={e => this.onSort(e, 'pct_saturated')}>Filled</th>
                            <th></th>

                          </tr>
                        </thead>

                        {this.state.filterAblePools.map((item) => (

                          item.pool_splitter == 'N' &&
                          <tbody>

                            <tr>
                              <td style={tableRowStyle} scope="row" ><p>{item.name}</p></td>
                              <td style={tableRowStyle} scope="row"><p>{item.ticker}</p></td>
                              <td style={tableRowStyle} scope="row"><p>{item.margin_pct}%</p></td>
                              {/* <td style={tableRowStyle} scope="row"><p>{item.cost_per_epoch}₳</p></td> */}
                              <td style={tableRowStyle} scope="row"><p>{this.addCommas(item.live_stake_delegator_count)}</p></td>
                              <td style={tableRowStyle} scope="row"><p>{this.addCommas(item.live_stake)}</p></td>
                              <td style={tableRowStyle} scope="row"><p>{Number(item.pct_saturated).toFixed(2)}%</p></td>

                              <Row><Link to={`/pool/${item.pool_id}`} target="_blank" rel="noopener noreferrer">
                                <p><Button variant="outline-light" size="sm">View</Button></p>
                              </Link>
                                {this.state.namiEnabled && <JoinPool pool={item} namiEnabled={this.state.namiEnabled} />}
                              </Row>
                            </tr>

                          </tbody>

                        ))}

                      </Table>
                      :
                      <Table {...{ ['striped']: true }}>
                        <thead>
                          <tr>
                            <th onClick={e => this.onSort(e, 'name')}>Name</th>
                            {/* <th onClick={e => this.onSort(e, 'ticker')}>Ticker</th> */}
                            <th onClick={e => this.onSort(e, 'live_stake')}>Stake</th>
                            <th onClick={e => this.onSort(e, 'pct_saturated')}>Filled</th>

                          </tr>
                        </thead>

                        {this.state.filterAblePools.map((item) => (
                          item.pool_splitter == 'N' &&
                          <tbody>

                            <tr onClick={() => this.handleRowClick(item)}>
                              <td style={tableRowStyle} scope="row" ><p>{item.name}<br />({item.ticker})</p></td>
                              {/* <td style={tableRowStyle} scope="row"><p>{item.ticker}</p></td> */}
                              <td style={tableRowStyle} scope="row"><p>{this.addCommas(item.live_stake)}</p></td>
                              <td style={tableRowStyle} scope="row"><p>{Number(item.pct_saturated).toFixed(2)}%</p></td>
                            </tr>

                          </tbody>

                        ))}

                      </Table>
                    }
                  </CardBody>
                </Card>
              </Col>


            </Row>
          </Col>



        }
      </Page>
    );
  }
}
export default PoolPeekCoinPools;
