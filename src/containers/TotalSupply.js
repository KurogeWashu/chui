import React from 'react';

import {withStore} from '@spyna/react-store'

class TotalSupplyContainer extends React.Component {
    render() {
      const {store} = this.props
      let deurTotalSupply = store.get('deurTotalSupply')
      if (deurTotalSupply) {
        deurTotalSupply = deurTotalSupply.toFormat(2, {groupSeparator: ',', groupSize: 3})
        return (<p>Dai locked in Deur: {deurTotalSupply} DAI</p>)
      } else {
        return ""
      }
    }
}

export default withStore(TotalSupplyContainer)
