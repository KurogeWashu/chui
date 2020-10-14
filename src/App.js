import React from 'react'
import { createStore } from '@spyna/react-store'
import Web3 from 'web3'

import config from './config.json'
import daiABI from './abi/Dai.abi.json'
import potABI from './abi/Pot.abi.json'
import chaiABI from './abi/Chai.abi.json'

import NavContainer from './containers/Nav'
import JoinExitContainer from './containers/JoinExit'
import ChaiBalanceContainer from './containers/ChaiBalance'
import TotalSupplyContainer from './containers/TotalSupply'
import TransferChaiContainer from './containers/TransferChai'
import { setupContracts, getData, WadDecimal } from './utils/web3Utils'

import theme from './theme/theme'

import Typography from '@material-ui/core/Typography'
import { withStyles, ThemeProvider } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
  },
  footer: {
    textAlign: 'center',
  },
  navContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 52
  },
  contentContainer: {
      // boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)',
      borderRadius: theme.shape.borderRadius,
      padding: 0,
      marginBottom: theme.spacing(3)
  }
})

const web3 = new Web3(new Web3.providers.HttpProvider(config.defaultWeb3Provider))

const initialState = {
    web3: web3,
    web3Failure: false,
    network: 42,
    potObject: new web3.eth.Contract(potABI, config.MCD_POT),
    daiObject: new web3.eth.Contract(daiABI, config.MCD_DAI),
    chaiObject: new web3.eth.Contract(chaiABI, config.CHAI),
    walletAddress: '',
    walletConnecting: false,
    walletType: '',
    daiBalance: '',
    daiAllowance: '',
    daiBalanceDecimal: new WadDecimal(0),
    allowanceAvailable: false,
    chaiBalance: '',
    chaiBalanceRaw: '',
    chaiBalanceDecimal: new WadDecimal(0),
    dsrRaw: '',
    dsr: '',
    chi: '',
    chiRaw:'',
    chaiTotalSupply:'',
    joinAmount: new WadDecimal(0),
    exitAmount: new WadDecimal(0),
    joinexitAction: 0,
    transferAmount: new WadDecimal(0),
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    async componentDidMount() {
    }

    render() {
        const classes = this.props.classes
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12}><br/></Grid>
                        <NavContainer />

                        <Grid item xs={12} md={6}>
                            <JoinExitContainer />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ChaiBalanceContainer />

                        </Grid>
                        <Grid item xs={12}>
                          <TransferChaiContainer />
                        </Grid>
                        <Grid item xs={12} className={classes.footer}>
                          Interacting with the dEuro contract at: <a target="_blank" href={"https://etherscan.io/token/" + config.CHAI} rel="noopener noreferrer">{config.CHAI}</a><br />
                          <TotalSupplyContainer />
                          <a href="/about.html">Learn more about </a>
                        </Grid>
                        <Grid item xs={12} className={classes.footer}>
                         digital euro by&nbsp;
                              <a target="_blank" href="https://github.com/ninonomad" rel="noopener noreferrer">Smiley</a>,&nbsp;
                              <a target="_blank" href="https://github.com/cereum" rel="noopener noreferrer">back</a>,&nbsp;
                              <a target="_blank" href="https://github.com/kurogewashu" rel="noopener noreferrer">rack</a>,&nbsp;
                              <a target="_blank" href="https://github.com/einstein816" rel="noopener noreferrer">front</a>,&nbsp;
                              <a target="_blank" href="https://github.com/iazigit" rel="noopener noreferrer">iazid</a>. <br />
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        )
    }
}

export default createStore(withStyles(styles)(App), initialState)
