import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { WadDecimal, getData, toDai } from '../utils/web3Utils'
// import { stake } from '../actions/main'

import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
// import Box from '@material-ui/core/Box'

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
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    accountBalance: {
        float: 'right',
    },
})

class DeurStakeContainer extends React.Component {

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


    setMax() {
      const {store} = this.props
      const deurBalanceDecimal = store.get('deurBalanceDecimal')
      store.set('stakeAmount', deurBalanceDecimal)
    }

    handleInput(event) {
      const {store} = this.props
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
        const {classes, store} = this.props
        // const dsr = store.get('dsr')
        const der = store.get('der')
        // const dsrPercent = dsr;
        // const deurStake = store.get('deurStake')
        // const deurStakeRaw = store.get('deurStakeRaw')
        const deurBalance = store.get('deurBalance')
        // const daiEquiv = deurStakeRaw ? toDai.bind(this)(deurStakeRaw).toFormat(5) : undefined


        const walletAddress = store.get('walletAddress')
        const web3 = store.get('web3')
        const isSignedIn = walletAddress && walletAddress.length
        const stakeAmount = store.get('stakeAmount')
        // const deurBalanceDecimal = store.get('deurBalanceDecimal')
        // const canExit = stakeAmount && (stakeAmount.cmp(deurBalanceDecimal) < 1)
        const canExit = true
      return <Card ><CardContent>
        <h2>Stake DEUR</h2>
{/*                  <CardMedia */}
{/*          component="img" */}
{/*                   style={{resizeMode: 'contain',     width: 100, float: 'right', paddingRight: 52 */}
{/* }} */}
{/*         src={deurStake > 0 ? logogif : logostill} */}
{/*          /> */}

        <p>1 DEUR = {der ? `${der}` : '?'} DAI</p>

        {/* <Box> */}
        <Button variant="text" className={classes.accountBalance}
      style={{textTransform: 'none'}}
      onClick={this.setMax.bind(this)}
        >{deurBalance? `Balance: ${deurBalance} DEUR` : '-'}</Button><br/>
        <TextField label="Stake Amount" placeholder='0' className={classes.input} margin="normal" variant="outlined" value={stakeAmount.toString() !== "0" ? stakeAmount : ''} type="number" onChange={this.handleInput.bind(this)} InputProps={{ inputProps: { min: 0 },
                            endAdornment: <InputAdornment className={classes.endAdornment} position="end">DEUR</InputAdornment>
                        }}
      helperText={(isSignedIn && stakeAmount) ? "You will receive at least: " + toDai.bind(this)(web3.utils.toWei(String(stakeAmount))) + " DEUR": " "}
        /><br/><br/><br/>
                    <Button color='primary'
                        size='large'
                        onClick={() => {
                            this.exit()
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
