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
import { baseUrlPoolPeekService, getisopools } from 'assets/services';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Timer from "react-compound-timer";
import JoinPool from 'components/wallet/JoinPool';
import { FormGroup, FormControlLabel, Switch, Checkbox } from '@material-ui/core';
import dd from 'assets/img/dripdropz.svg';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const width = window.innerWidth;



const tableRowStyle = {
  // borderBottom: 'solid 3px blue',
  // background: 'green',
  color: 'green',
  fontWeight: 'bold',
  // padding: 0,
};

const tableRowStyleBad = {
  // borderBottom: 'solid 3px blue',
  // background: 'green',
  color: 'red',
  fontWeight: 'bold',
  // textDecoration: 'line-through'

  // padding: 0,
};

const tableRowStyleWarning = {
  // borderBottom: 'solid 3px blue',
  // background: 'green',
  color: 'orange',
  fontWeight: 'bold',
  // textDecoration: 'line-through'

  // padding: 0,
};

class SundaePoolsReverse extends React.Component {
  state = {
    pools: null,
    loading: true,
    totalPools: '',
    smallScreen: false,
    searched: "",
    filterAblepools: [],
    stats: null,
    namiEnabled: false,
    sortOrder: 'desc',
    timerReset: null,
    refreshAmount: 60000,
    autorefresh: false
  };

  async componentDidMount() {

    if (width < 600) {
      this.setState({ smallScreen: true });
    }
    await this.getSundaePools();
  }

  async refresher(refresh) {
    while (refresh) {
      await this.sleep(this.state.refreshAmount);
      this.getSundaePools();
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getSundaePools() {
    try {
      this.setState({ timerReset: null })
      var response = await fetch(baseUrlPoolPeekService + getisopools + 'reversesundaepools');
      const data = await response.json();

      this.setState({ stats: data.poolDetailsSundaeStatsVO, timerReset: this.state.refreshAmount })
      this.createRows(data);
    } catch (error) {
      console.log(error)
    }
  }
  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  createRows(sundaeData) {
    var rows = [];

    var poolsList = [];
    poolsList = this.shuffle(sundaeData.pools);



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

    //get current sort order
    if (this.state.sortOrder == 'desc') {
      if (sortKey == 'name' || sortKey == 'ticker') {
        const data = this.state.filterAblePools;
        data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        this.setState({ loading: false, filterAblePools: data })
      } else {
        const data = this.state.filterAblePools;
        data.sort((a, b) => Number(a[sortKey]) - (Number(b[sortKey])))
        this.setState({ loading: false, filterAblePools: data })
      }
      this.setState({ sortOrder: 'asc' })
    } else {
      if (sortKey == 'name' || sortKey == 'ticker') {
        const data = this.state.filterAblePools;
        data.sort((a, b) => b[sortKey].localeCompare(a[sortKey]))
        this.setState({ loading: false, filterAblePools: data })
      } else {
        const data = this.state.filterAblePools;
        data.sort((a, b) => Number(b[sortKey]) - (Number(a[sortKey])))
        this.setState({ loading: false, filterAblePools: data })
      }
      this.setState({ sortOrder: 'desc' })
    }


  }

  handleAdvancedClick() {
    if (this.state.autorefresh) {
      this.setState({ autorefresh: false });
      this.refresher(false);
    }
    else {
      this.setState({ autorefresh: true });
      this.refresher(true);
    }
  }

  getRowStyle(pct_saturated) {

    if (pct_saturated > 90 && pct_saturated < 100) {
      return tableRowStyleWarning;
    } else if (pct_saturated > 100) {
      return tableRowStyleBad;
    }
    else {
      return tableRowStyle
    }
  }

  render() {

    return (
      <Page
        className="SundaeRISOPools"
        title="SundaeSwap RISO"
      >
        {this.state.loading ? <div><CircleLoader color={'#45b649'} loading={this.state.loading} css={override} size={180} /></div>
          : <Col>
            <Row style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
                   <h1 style={{ color: 'red' }}>THIS ISO HAS ENDED!</h1>
            </Row>

            <Row style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <p>Auto refresh data: <FormControlLabel style={{ align: "center", display: 'inline-block' }} value="all"
                control={<Switch size="small" checked={this.state.autorefresh} onChange={e => this.handleAdvancedClick()}
                />}
              /></p></Row>

            {this.state.timerReset != null && this.state.autorefresh &&
              <Row style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <Timer
                  initialTime={this.state.timerReset}
                  direction="backward"
                >
                  <small>Data will refresh in: <Timer.Seconds /></small>
                </Timer></Row>}

            <Row>



              <Col lg={4} md={12} sm={12} xs={12} className="mb-3">

                <Col>
                  <Row style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                    <h3>Dates</h3>
                  </Row>
                  <Row style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                    <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                      <Card inverse color='primary'>
                        <CardBody body>
                          <CardTitle className="text-capitalize">
                            RISO Start Date
                          </CardTitle>
                          <CardText>
                            February 19th
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                      <Card inverse color='secondary'>
                        <CardBody body>
                          <CardTitle className="text-capitalize">
                            RISO End Date
                          </CardTitle>
                          <CardText>
                          February 24th
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>

                    {/* <Col lg={2} md={12} sm={12} xs={12} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody body>
                        <CardTitle className="text-capitalize">
                          Pools Involved
                        </CardTitle>
                        <CardText>
                          {this.state.stats.total_pools}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col> */}


                  </Row>
                </Col>

                <hr></hr>
                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                  <h3>Starting Stats</h3>
                </Row>

                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>

                  <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          ADA Staked
                        </CardTitle>
                        <CardText>
                          595,634,073
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='primary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Wallets Delegated
                        </CardTitle>
                        <CardText>
                          59,255
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <hr></hr>
                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                  <h3>Live Stats</h3>
                </Row>

                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>

                  <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='primary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          ADA Staked
                        </CardTitle>
                        <CardText>
                          {this.addCommas(this.state.stats.total_live_stake)}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                    <Card inverse color='secondary'>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          Wallets Delegated
                        </CardTitle>
                        <CardText>
                          {this.addCommas(this.state.stats.live_stake_delegator_count)}
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <hr></hr>
                <Row style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                  <p>More info on RISO: <a href='https://sundaeswap-finance.medium.com/the-reverse-iso-proposal-promoting-cardanos-decentralization-5bbd2b290485' target="_blank" rel="noreferrer" ><b>HERE</b></a></p>
                </Row>

                <hr></hr>
                <Col style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                  <a href='https://discord.gg/6nZh34ZBkH' target="_blank" rel="noreferrer" >
                    <p>SundaeSwap Discord</p> <FontAwesomeIcon size="2x" icon={faDiscord} /> </a>
                </Col>
              </Col>
              <Col lg={8} md={12} sm={12} xs={12} className="mb-3" style={{
                height: 700,
                overflow: 'auto'
              }}>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="mb-3">

                    <Card>

                      <CardBody body style={{
                        padding: '5px', margin: '0px',
                      }}>
                        <CardTitle className="text-capitalize">
                          <b>{this.state.stats.total_pools} Eligible Pools</b>
                        </CardTitle>
                        <small>Table sortable by clicking on the headers.</small><br></br>
                        <small style={{ color: 'red' }}>DONT STAKE</small><small>-</small>
                        <small style={{ color: 'orange' }}>RISK OF OVERSTAKE</small><small>-</small>
                        <small style={{ color: 'green' }}>STAKE HERE</small>
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
                                <th onClick={e => this.onSort(e, 'blocks')}>LifeTime Blocks</th>
                                <th onClick={e => this.onSort(e, 'pct_saturated')}>Filled</th>
                                <th></th>

                              </tr>
                            </thead>

                            {this.state.filterAblePools.map((item) => (
                              item.retired == 'N' &&
                              <tbody>

                                <tr style={
                                  this.getRowStyle(item.pct_saturated)
                                }>


                                  <td scope="row" ><p>{item.name}</p></td>
                                  <td scope="row"><p>{item.ticker}</p></td>
                                  <td scope="row"><p>{item.margin_pct}%</p></td>
                                  {/* <td style={tableRowStyle} scope="row"><p>{item.cost_per_epoch}₳</p></td> */}
                                  <td scope="row"><p>{this.addCommas(item.live_stake_delegator_count)}</p></td>
                                  <td scope="row"><p>{this.addCommas(item.live_stake)}</p></td>
                                  <td scope="row"><p>{this.addCommas(item.blocks)}</p></td>
                                  <td scope="row"><p>{Number(item.pct_saturated).toFixed(2)}%</p></td>

                                  <Row><Link to={`/pool/${item.pool_id}`} target="_blank" rel="noopener noreferrer">
                                    <p><Button variant="outline-light" size="sm">View</Button></p>
                                  </Link>
                                    {Number(item.pct_saturated) < 100 && <JoinPool pool={item} />}
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
                              item.retired == 'N' &&
                              <tbody>

                                <tr style={
                                  Number(item.pct_saturated) > 100
                                    ? tableRowStyleBad
                                    : tableRowStyle
                                } onClick={() => this.handleRowClick(item)}>
                                  <td scope="row" ><p>{item.name}<br />({item.ticker})</p></td>
                                  {/* <td style={tableRowStyle} scope="row"><p>{item.ticker}</p></td> */}
                                  <td scope="row"><p>{this.addCommas(item.live_stake)}</p></td>
                                  <td scope="row"><p>{Number(item.pct_saturated).toFixed(2)}%</p></td>
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
            </Row>
          </Col>}






      </Page>
    );
  }
}
export default SundaePoolsReverse;