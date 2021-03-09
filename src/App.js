import * as queries from './assets/queries/quickqueries';
import GAListener from 'components/GAListener';
import { MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import DashboardPage from 'pages/DashboardPage';
import QuickQueriesPage from 'pages/QuickQueriesPage';
import AdaFoliosPage from 'pages/AdaFoliosPage';
import FunDumpPage from 'pages/FunDumpPage';
import AboutUsPage from 'pages/AboutUsPage';
import PoolMapPage from 'pages/PoolMap';

require('./styles/reduction.scss');

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <MainLayout breakpoint={this.props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <Route exact path="/" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="The Dynamic Duo - Creators of PoolPeek.com!" query={queries.poolpeekquery} multiPoolOperators={true} pageDescription={queries.dynamicduopoolsqueryDesc} />} />

                <Route exact path="/poolsearch" render={(props) => <DashboardPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} query={'&excluderetired=1'} />} />

                <Route exact path="/poolsearchmap" render={(props) => <PoolMapPage />} />


                <Route exact path="/aboutus" render={(props) => <AboutUsPage />} />
                {/* <Route exact path="/:poolid" render={(props) => <DashboardPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} query={'&excluderetired=1'} />} /> */}

                <Route exact path="/baremetalpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Bare Metal" query={queries.baremetalquery} multiPoolOperators={true} pageDescription={queries.baremetalpoolsqueryDesc} />} />
                <Route exact path="/educationpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Education" query={queries.educationquery} multiPoolOperators={true} pageDescription={queries.educationpoolsqueryDesc} />} />
                <Route exact path="/charitypools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Charity" query={queries.charityquery} multiPoolOperators={true} pageDescription={queries.charitypoolsqueryDesc} />} />

                <Route exact path="/zeroblockpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Zero Block Small Pools" query={queries.zeroblockpoolsquery} multiPoolOperators={true} pageDescription={queries.zeroblockpoolsqueryDesc} />} />
                <Route exact path="/onetotenblockpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="One to Ten Block Small Pools" query={queries.onetotenpoolsquery} multiPoolOperators={true} pageDescription={queries.onetotenblockpoolsqueryDesc} />} />
                <Route exact path="/likelytoproduceblocks" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Small Pools Likely to Produce Blocks" query={queries.smallproduceblocksquery} multiPoolOperators={true} pageDescription={queries.smallproduceblocksDesc} />} />

                <Route exact path="/retiringpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Soon Retiring" query={queries.retiringpoolsquery} multiPoolOperators={false} pageDescription={queries.soonretiringpoolsqueryDesc} />} />
                <Route exact path="/retiredpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Retired" query={queries.retiredpoolsquery} multiPoolOperators={false} pageDescription={queries.retiredpoolsqueryDesc} />} />
                {/* <Route exact path="/marchsaturatedpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="March Saturated" query={queries.marchsaturatedpoolsquery}  multiPoolOperators={false}  pageDescription={queries.marchsaturatedpoolsqueryDesc} />} /> */}

                <Route exact path="/adafolio" render={(props) => <AdaFoliosPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="adafolio Portfolio" query="" />} />

                <Route exact path="/fabuloustickers" render={(props) => <FunDumpPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Fabulous Tickers" query={queries.funtickersquery} />} />
                <Route exact path="/fabulousnames" render={(props) => <FunDumpPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Fabulous Names" query={queries.funnamesquery} />} />
                <Route exact path="/fabulousdescriptions" render={(props) => <FunDumpPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Fabulous Descriptions" query={queries.fundescriptionsquery} />} />

                <Route exact path="/twitterpools" render={(props) => <QuickQueriesPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} title="Small Pools w/Twitter Handles" query={queries.twitterpoolsquery} multiPoolOperators={true} pageDescription={queries.twitterpoolsqueryDesc} />} />


                <Route exact path="/pool/:poolid" render={(props) => <DashboardPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} query={'&excluderetired=1'} />} />
                <Route exact path="/poolsearch/:location" render={(props) => <DashboardPage {...props} key={Math.floor(Math.random() * 100) + Date.now()} query={'&excluderetired=1'} />} />


              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
