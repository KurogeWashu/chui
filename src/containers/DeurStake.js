import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'
import {
    WadDecimal,
    getData
    // , toDai 
} from '../utils/web3Utils'
import { stake, unstake } from '../actions/main'

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

    unstake() {
        unstake.bind(this)()
    }

    setMax() {
        const { store } = this.props
        const id = this.event.id
        const balance = store.get('dai' + id  + 'Balance')
        store.set(id + 'stakeAmount', balance) //TODO
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
        store.set(event.target.id + 'StakeAmount', value)
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
        const dankStakeAmount = store.get('dankStakeAmount')
        const deurStakeAmount = store.get('deurStakeAmount')
        // const deurBalanceDecimal = store.get('deurBalanceDecimal')
        // const canExit = stakeAmount && (stakeAmount.cmp(deurBalanceDecimal) < 1)
        const canExit = true

        // below is from DeurBalance
        const der = store.get('der')
        // const deurBalance = store.get('deurBalance')
        // const deurBalanceDec = store.get('deurBalanceDecimal')
        // let deurBdai = der && deurBalanceDec ? deurBalanceDec.mul(der).div('1e18').toFormat(3) : '-'
        // const dankBalance = store.get('dankBalance')
        // const dankBalanceDec = store.get('dankBalanceDecimal')
        // let dankBdai = der && dankBalanceDec ? dankBalanceDec.mul(der).div('1e18').toFormat(3) : '-'
        // const deurTotalSupply = store.get('deurTotalSupply')
        // const deurTotalSupplyDec = store.get('deurTotalSupplyDecimal')
        // let deurTSdai = der && deurTotalSupplyDec ? deurTotalSupplyDec.mul(der).div('1e18').toFormat(2) : '-'
        // const dankTotalSupply = store.get('dankTotalSupply')
        // const dankTotalSupplyDec = store.get('deurTotalSupplyDecimal')
        // let dankTSdai = der && dankTotalSupplyDec ? dankTotalSupplyDec.mul(der).div('1e18').toFormat(2) : '-'
        // const daidankTotalSupply = store.get('daidankTotalSupply')
        const daidankTotalSupplyDec = store.get('daidankTotalSupplyDecimal')
        let daidankTSdai = der && daidankTotalSupplyDec ? daidankTotalSupplyDec.mul(der).div('1e18').toFormat(2) : '-'
        // const daideurTotalSupply = store.get('daideurTotalSupply')
        const daideurTotalSupplyDec = store.get('daideurTotalSupplyDecimal')
        let daideurTSdai = der && daideurTotalSupplyDec ? daideurTotalSupplyDec.mul(der).div('1e18').toFormat(2) : '-'
        const dankAPY = (((1+(50000/((daidankTSdai ? daidankTSdai : 0)*2))/52)**52-1)/10000000000000000)
        const deurAPY = (((1+(50000/((daideurTSdai ? daideurTSdai : 0)*2))/52)**52-1)/10000000000000000)

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

        // APY = ((1+(100000(daidankTSdai*2))/52)**52-1)*100
        // APY = (toDeur.bind(this)(web3.utils.toWei(String(daidankTSdai)))*2*100000*52)/daidankTSdai
        const pools = [{
            id: 'dank',
            img: '',
            symbol: 'DAI-DANK',
            lpSize: daidankTSdai ? daidankTSdai : 0,
            apyEst: dankAPY ? dankAPY : 0,
            stakedAmount: dankStakeAmount ? dankStakeAmount : 0,
            walletBalance: daidankBalance ? daidankBalance : 0,
            tokenAddress: '0xD32b1019A20428B49893628FC9deDA2A04A3EB73',
            tokenContract: '0xA424E3468a093d1f33F64723a71eb33983E8a9fc',
            stakeAmount: dankStakeAmount ? dankStakeAmount : 0
        }, {
        //     img: '',
        //     symbol: 'USDC',
        //     apyEst: 0,
        //     stakedAmount: 0.1,
        //     walletBalance: 0.111,
        //     tokenAddress: '',
        //     tokenContract: ''
        // }, {
            id: 'deur',
            img: '',
            symbol: 'DAI-DEUR',
            lpSize: daideurTSdai ? daideurTSdai : 0,
            apyEst: deurAPY ? deurAPY : 0,
            stakedAmount: deurStakeAmount ? deurStakeAmount : 0,
            walletBalance: daideurBalance ? daideurBalance : 0,
            tokenAddress: '0xD32b1019A20428B49893628FC9deDA2A04A3EB73',
            tokenContract: '0xda23f3f1cb0bfceeb403f6c045bcc1627d8cb04f',
            stakeAmount: deurStakeAmount ? deurStakeAmount : 0
        // }, {
        //     img: '',
        //     symbol: 'DEUR-USDC',
        //     apyEst: 0,
        //     stakedAmount: 0.1,
        //     walletBalance: 0.111,
        //     tokenAddress: '',
        //     tokenContract: ''
        // }, {
            // img: '',
            // symbol: 'DANK-DEUR',
            // lpSize: 0,
            // apyEst: 0,
            // stakedAmount: 0.1,
            // walletBalance: 0.111,
            // tokenAddress: '',
            // tokenContract: ''
        }
        ];


        return <Card ><CardContent>
        <Typography variant='h4'>Stake</Typography><br/>


        <Grid container spacing={3} justify="space-around" alignItems="center" >
            <Grid item xs sm={3} md>&nbsp;&nbsp;Pool</Grid>
            <Hidden xsDown>
                <Grid item sm={2} md className={classes.numCol}>APY</Grid>
                <Hidden smDown>
                    <Grid item md className={classes.numCol}>LP Size</Grid>
                    <Grid item md className={classes.numCol}>Your Stake</Grid>
                    <Grid item md className={classes.numCol}>Unstaked</Grid>
                </Hidden>
            </Hidden>
            <Grid item xs sm={4} md={3} className={classes.numCol}>Amount&nbsp;&nbsp;</Grid>
          {/* <Grid item xs={12} sm={0}><br/></Grid> */}
        </Grid>


        {pools.map((tile)=>(
            <Grid container spacing={3} justify="space-around" alignItems="center" key={tile.symbol}>
              {/* Pool Name */}
              <Grid item xs sm={3} md={2}>
                  <Grid container justify-xs-space-around="true" align-content-xs-space-around="true">
                      <Grid item xs={1} sm={2}>
                          <img src={(tile.img==='') ? 'placeholder image': tile.img} alt={(tile.img==='') ? '': tile.symbol+'_logo'}/>
                      </Grid>
                      <Grid item xs={10} sm={10}>{tile.symbol}</Grid>
                  </Grid>
              </Grid>
              

            <Hidden xsDown>
              {/* APR */}
              <Grid item sm={2} md className={classes.numCol}>
                  {tile.apyEst}
                  {/* add Dank token apr */}
              </Grid>

                <Hidden smDown>
                  {/* LP Size */}
                  <Grid item sm={2} md className={classes.numCol}>
                      {tile.lpSize} %
                      {/* add Dank token apr */}
                  </Grid>
                  {/* Staked Balance */}
                  <Grid item md className={classes.numCol}>
                    {/* <Button variant="text" className={classes.accountBalance} */}
                    {/* style={{textTransform: 'none'}} */}
                    {/* onClick={this.setMax.bind(this)} */}
                    {/* >{(deurBalance>0)? deurBalance : '-'}</Button> */}
                    {tile.stakedAmount}
                  </Grid>

                  {/* Unstaked Balance */}
                  {/* TODO: mac balance button */}
                  <Grid item md className={classes.numCol}>
                      {tile.walletBalance - tile.stakedAmount}
                  </Grid>
                </Hidden>
            </Hidden>


              {/* Amount Action */}
              <Grid item xs={7} sm={4} md={3} className={classes.numCol}>
                  <TextField id={tile.id} label='Stake Amount' placeholder='0' className={classes.input} variant="outlined" value={tile.stakeAmount} type="number" 
                       onChange={this.handleInput.bind(this)}
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
                    <Button color='primary'
                        size='large'
                        onClick={() => { this.stake()}} 
                        variant="contained" 
                        disabled={!isSignedIn || !canExit} 
                        className={classes.actionButton}>
                    stake
                    </Button>
                    
                    <Button color='primary'
                        size='large'
                        onClick={() => { this.unstake()}} 
                        variant="contained" 
                        disabled={!isSignedIn || !canExit} 
                        className={classes.actionButton}>
                    unstake
                    </Button>

                    {/* </Box> */}
        {/* <p>Dai Savings Rate: {dsrPercent ? `${dsrPercent}% per year` : '-'}</p> */}
        </CardContent></Card>
    }
}

export default withStyles(styles)(withStore(DeurStakeContainer))
