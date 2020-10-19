import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import { toDai } from '../utils/web3Utils';

import logogif from '../assets/logo.gif'
import logostill from '../assets/logostill.png'

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
})

class DeurBalanceContainer extends React.Component {

    async componentDidMount() {
        // update data periodically
        this.watchDsrData()
    }

    async watchDsrData() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    render() {
        const {store} = this.props
        // const dsr = store.get('dsr')
        const der = store.get('der')
        // const dsrPercent = dsr;
        const deurBalance = store.get('deurBalance')
        const deurTotalSupply = store.get('deurTotalSupply')
        const deurBalanceRaw = store.get('deurBalanceRaw')
        const daiEquiv = deurBalanceRaw ? toDai.bind(this)(deurBalanceRaw).toFormat(5) : undefined
      return <Card ><CardContent>
        <h2>You have digitized {deurBalance ? deurBalance : '0'} euros</h2>
                 <CardMedia
         component="img"
                  style={{resizeMode: 'contain',     width: 100, float: 'right', paddingRight: 52
}}
        src={deurBalance > 0 ? logogif : logostill}
         />

        <p>Deur balance: {deurBalance ? `${deurBalance}` : '-'} {der ? `(~ ${der*deurBalance} DAI)` : ''}</p>
        <p>Total supply: {deurTotalSupply ? `${deurTotalSupply}` : '-'}
         {/* {der ? `(~ ${der*deurTotalSupply} DAI)` : ''} */}
         </p>
        {/* <p>Dai Savings Rate: {dsrPercent ? `${dsrPercent}% per year` : '-'}</p> */}
        <a target="_blank" href="/about.html" rel="noopener noreferrer">Learn more</a>
        </CardContent></Card>
    }
}

export default withStyles(styles)(withStore(DeurBalanceContainer))
