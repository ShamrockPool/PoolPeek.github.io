import FetchPoolList from 'components/FetchPoolList';
import Page from 'components/Page';
import React from 'react';
import { isEmpty } from 'utils/stringutil.js';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      poolid: ""
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }



  render() {
    return (
      <Page
        className="DashboardPage"
      // title="Pool Search"
      // breadcrumbs={[{ name: 'Home', active: true }]}
      >
        {isEmpty(this.props.match.params.poolid) ? <FetchPoolList {...this.props} query={this.props.query} />
          :
          <FetchPoolList {...this.props} multiPoolOperators={false} query={this.props.query} poolid={this.props.match.params.poolid} />
        }


      </Page>
    );
  }
}
export default DashboardPage;
