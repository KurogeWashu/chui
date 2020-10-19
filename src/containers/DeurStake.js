import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import {
    WadDecimal,
    getData
    // , toDai 
} from '../utils/web3Utils'
import { stake } from '../actions/main'

import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import Box from '@material-ui/core/Box'
// import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import ListSubheader from '@material-ui/core/ListSubheader';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

// import logogif from '../assets/logo.gif'
// import logostill from '../assets/logostill.png'

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
    input: {
        width: '100%',
        // marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(3)
    },
    accountBalance: {
        float: 'right',
    },
    numCol: {
        justifyContent: 'right',
        display: 'flex',
    },
})

class DeurStakeContainer extends React.Component {

    async componentDidMount() {
        // update data periodically
      //  this.watchDsrData()
    }

    async watchDsrData() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    stake() {
        stake.bind(this)()
    }

    setMax() {
        const { store } = this.props
        const deurBalanceDecimal = store.get('deurBalanceDecimal')
        store.set('stakeAmount', deurBalanceDecimal)
    }

    handleInput(event) {
        const { store } = this.props
        let value
        try {
            value = new WadDecimal(event.target.value)
        } catch {
            if (event.target.value.length === 0) {
                value = new WadDecimal(0)
            } else {
                return
            }
        }
        store.set('stakeAmount', value)
    }

    render() {
        const { classes, store } = this.props
        // const dsr = store.get('dsr')
        // const der = store.get('der')
        // const dsrPercent = dsr;
        // const deurStake = store.get('deurStake')
        // const deurStakeRaw = store.get('deurStakeRaw')
        // const deurBalance = store.get('deurBalance')
        // const daiEquiv = deurStakeRaw ? toDai.bind(this)(deurStakeRaw).toFormat(5) : undefined
        const daidankBalance = store.get('daidankBalance')
        const daideurBalance = store.get('daideurBalance')

        const walletAddress = store.get('walletAddress')
        // const web3 = store.get('web3')
        const isSignedIn = walletAddress && walletAddress.length
        const stakeAmount = store.get('stakeAmount')
        // const deurBalanceDecimal = store.get('deurBalanceDecimal')
        // const canExit = stakeAmount && (stakeAmount.cmp(deurBalanceDecimal) < 1)
        const canExit = true


        /**
         * The pools data is structured as follows:
         *
         * import image from 'path/to/image.jpg';
         * [etc...]
         *
         * const tileData = [
         *   {
         *     img: image,
         *     name: 'token',
         *     apyEst: '%',
         *     stakedAmount: '0.1',
         *     walletBalance: '0.111',
         *   },
         *   {
         *     [etc...]
         *   },
         * ];
         */
        const pools = [{
            img: '',
            symbol: 'DAI-DANK',
            apyEst: 0,
            stakedAmount: 0.1,
            walletBalance: daidankBalance? daidankBalance : 0,
            tokenAddress: '',
            tokenContract: ''
        }, {
            img: '',
            symbol: 'USDC',
            apyEst: 0,
            stakedAmount: 0.1,
            walletBalance: 0.111,
            tokenAddress: '',
            tokenContract: ''
        }, {
            img: '',
            symbol: 'DAI-DEUR',
            apyEst: 0,
            stakedAmount: 0.1,
            walletBalance: daideurBalance? daideurBalance : 0,
            tokenAddress: '',
            tokenContract: ''
        }, {
            img: '',
            symbol: 'DEUR-USDC',
            apyEst: 0,
            stakedAmount: 0.1,
            walletBalance: 0.111,
            tokenAddress: '',
            tokenContract: ''
        }];


        return <Card ><CardContent>
        <Typography variant='h4'>Stake</Typography>


        <Grid container spacing={3} justify="space-around" alignItems="center" >
            <Grid item xs sm={3}>&nbsp;&nbsp;Pool</Grid>
            <Hidden xsDown>
                <Grid item sm={2} className={classes.numCol}>APY</Grid>
                <Hidden smDown>
                    <Grid item className={classes.numCol}>Staked</Grid>
                    <Grid item className={classes.numCol}>Unstaked</Grid>
                </Hidden>
            </Hidden>
            <Grid item xs sm={4} className={classes.numCol}>Amount&nbsp;&nbsp;</Grid>
          {/* <Grid item xs={12} sm={0}><br/></Grid> */}
        </Grid>


        {pools.map((tile)=>(
            <Grid container spacing={3} justify="space-around" alignItems="center" key={tile.symbol}>
              {/* Pool Name */}
              <Grid item xs sm={3}>
                  <Grid container justify-xs-space-around="true" align-content-xs-space-around="true">
                      <Grid item xs={1} sm={2}>
                          <img src={(tile.img==='') ? 'placeholder image': tile.img} alt={(tile.img==='') ? '': tile.symbol+'_logo'}/>
                      </Grid>
                      <Grid item xs={10} sm={10}>{tile.symbol}</Grid>
                  </Grid>
              </Grid>
              

            <Hidden xsDown>
              {/* APR */}
              <Grid item sm={2} className={classes.numCol}>
                  {(tile.apyEst).toFixed(2)}
                  {/* add Dank token apr */}
              </Grid>

                <Hidden smDown>
                  {/* Staked Balance */}
                  <Grid item className={classes.numCol}>
                    {/* <Button variant="text" className={classes.accountBalance} */}
                    {/* style={{textTransform: 'none'}} */}
                    {/* onClick={this.setMax.bind(this)} */}
                    {/* >{(deurBalance>0)? deurBalance : '-'}</Button> */}
                    {(tile.stakedAmount).toFixed(2)}
                  </Grid>

                  {/* Unstaked Balance */}
                  {/* TODO: mac balance button */}
                  <Grid item className={classes.numCol}>
                      {(tile.walletBalance - tile.stakedAmount).toFixed(2)}
                  </Grid>
                </Hidden>
            </Hidden>


              {/* Amount Action */}
              <Grid item xs={7} sm={4} className={classes.numCol}>
                  <TextField label="Stake Amount" placeholder='0' className={classes.input} variant="outlined" value={stakeAmount.toString() !== "0" ? stakeAmount : ''} type="number" 
                      // onChange={this.handleInput.bind(this)} 
                      // InputProps={{ inputProps: { min: 0 },
                      //       endAdornment: <InputAdornment className={classes.endAdornment} position="end">DEUR</InputAdornment>
                      //               }}
                    />
              </Grid>
            </Grid>
        ))}
        {/* <GridList cellHeight={70} cols={4}> */}
        {/*     <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}> */}
        {/*       <ListSubheader component="div">Pool</ListSubheader> */}
        {/*       <ListSubheader component="div">DEUR APY</ListSubheader> */}
        {/*       <ListSubheader component="div">Staked Balance</ListSubheader> */}
        {/*       <ListSubheader component="div">Unstaked Balance</ListSubheader> */}
        {/*       <ListSubheader component="div">Amount</ListSubheader> */}
        {/*     </GridListTile> */}
        {/*     {pools.map((tile)=>( */}
        {/*         <GridListTile> */}
        {/*              */}
        {/*         </GridListTile> */}
        {/*     ))} */}
        {/* </GridList> */}





        {/* <Box> */}<br/>
        <br/><br/><br/>
                    <Button color='primary'
                        size='large'
                        onClick={() => {
                            this.stake()
                        }} variant="contained" disabled={!isSignedIn || !canExit} className={classes.actionButton}>
                       Stake DEUR
                    </Button>
                    {/* </Box> */}
        {/* <p>Dai Savings Rate: {dsrPercent ? `${dsrPercent}% per year` : '-'}</p> */}
        {/* <a target="_blank" href="/about.html" rel="noopener noreferrer">Learn more</a> */}
        </CardContent></Card>
    }
}

export default withStyles(styles)(withStore(DeurStakeContainer))
