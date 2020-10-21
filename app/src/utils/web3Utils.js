import Web3 from "web3"
import config from '../config.json'
import erc20 from '../abi/ERC20.json'
import potABI from '../abi/Pot.abi.json'
import chaiABI from '../abi/Chai.abi.json'
import managerABI from '../abi/Manager.json'
import UniPoolABI from '../abi/UniPool.json'
import poolABI from '../abi/Pools.json'
let Decimal = require('decimal.js-light')
Decimal = require('toformat')(Decimal)


export const WadDecimal = Decimal.clone({
  rounding: 1, // round down
  precision: 78,
  toExpNeg: -18,
  toExpPos: 78,
})

WadDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
}

function toFixed(num, precision) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

export const approve = async (contract, spender, wallet, amount) => {
    /*  Approve spender to use amount of contract coins from wallet 
     *  contract: web3 Contract
     *  wallet, spender: string 0x eth address
     *  amount: allowance in Wei
     */

    const amountDecimal = new WadDecimal(amount)
    const allowance = await contract.methods
                                  .allowance(wallet, spender).call()
    const allowanceDecimal = new WadDecimal(allowance)
    if (allowanceDecimal.cmp(amountDecimal) < 0) {
        await contract.methods.approve(spender, amount)

    // Switch to increaseAllowance 
    return contract.methods.approve(spender, amount)
                   .send({from: wallet})
                  // .then(log) // add any notification
    }

}


export const getPotDsr = async function() {
  const { store } = this.props
  // const pot = store.get('potObject')
  // if (!pot) return

  const mgr = store.get('mgrObject')
  if (!mgr) return
  
  // const dsrRaw = await pot.methods.dsr().call()
  // const dsrRaw = await mgr.methods.getdEur_DAI().call()
  const dsrRaw = 100000
  if (dsrRaw === store.get('dsrRaw')) return
  store.set('dsrRaw', dsrRaw)
  let dsr = toFixed(new WadDecimal(dsrRaw).div('1e27').pow(secondsInYear).minus(1).mul(100), 2)
  store.set('dsr', dsr.toString())
}

// export const getPotChi = async function() {
//   const { store } = this.props
//   const pot = store.get('potObject')
//   if (!pot) return
//   const chiRaw = await pot.methods.chi().call()
//   if (chiRaw === store.get('chiRaw')) return
//   store.set('chiRaw', chiRaw)
//   let chi = toFixed(new WadDecimal(chiRaw).div('1e27'), 5)
//   store.set('chi', chi.toString())
// }

export const getPotDer = async function() {
  const { store } = this.props
  const mgr = store.get('mgrObject')
  if (!mgr) return
  // const derRaw = await mgr.methods.getdEur_DAI().call()
  const derRaw = 116974257
  if (derRaw === store.get('derRaw')) return
  store.set('derRaw', derRaw)
  // let der = toFixed(new WadDecimal(derRaw).div('1e27'), 5)
  let der = toFixed(new WadDecimal(derRaw).div('1e8'), 5)
  store.set('der', der.toString())
}

export const getDaiAllowance = async function() {
  const { store } = this.props
  const walletAddress = store.get('walletAddress')
  const dai = store.get('daiObject')
  if (!dai || !walletAddress) return
  const daiAllowance = await dai.methods.allowance(walletAddress, config.MANAGER).call()
  store.set('daiAllowance', new WadDecimal(daiAllowance).div('1e18'))
}

export const getDeurAllowance = async function() {
  const { store } = this.props
  const walletAddress = store.get('walletAddress')
  const deur = store.get('deurObject')
  if (!deur || !walletAddress) return
  const deurAllowance = await deur.methods.allowance(walletAddress, config.MANAGER).call()
  store.set('deurAllowanceRaw', deurAllowance)
  store.set('deurAllowance', new WadDecimal(deurAllowance).div('1e18'))
}

export const getDaiBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const dai = store.get('daiObject')
  if (!dai || !walletAddress) return
  const daiBalanceRaw = await dai.methods.balanceOf(walletAddress).call()
  const daiBalanceDecimal = new WadDecimal(daiBalanceRaw).div('1e18')
  store.set('daiBalanceDecimal', daiBalanceDecimal)
  const daiBalance = toFixed(parseFloat(web3.utils.fromWei(daiBalanceRaw)),5)
  store.set('daiBalance', daiBalance)
}

export const getChaiBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const chai = store.get('chaiObject')
  const walletAddress = store.get('walletAddress')
  if (!chai || !walletAddress) return
  // const chaiBalanceRaw = await chai.methods.balanceOf(walletAddress).call()
  const chaiBalanceRaw = '1000000'
  store.set('chaiBalanceRaw', chaiBalanceRaw)
  const chaiBalanceDecimal = new WadDecimal(chaiBalanceRaw).div('1e18')
  store.set('chaiBalanceDecimal', chaiBalanceDecimal)
  const chaiBalance = toFixed(parseFloat(web3.utils.fromWei(chaiBalanceRaw)),5)
  store.set('chaiBalance', chaiBalance)
}


// TODO
// Why not get all token balances we need in one function?
export const getDeurBalance = async function() {
  const { store } = this.props
  const walletAddress = store.get('walletAddress')
  if (!walletAddress) return 

  const getERC20Balance = async (contract, name) => {
    const balanceRaw = await contract.methods.balanceOf(walletAddress).call()   
    const balanceDecimal = new WadDecimal(balanceRaw)
    store.set(name + 'BalanceRaw', balanceRaw)
    store.set(name + 'BalanceDecimal', balanceDecimal)
    store.set(name + 'Balance', balanceDecimal.div('1e18').toFormat(3))
    //console.log(balanceDecimal.div('1e18').toFormat(5)) 
  }

  const deur = store.get('deurObject')
  if (deur) await getERC20Balance(deur, 'deur')     
  
  const dank = store.get('dankObject')
  if (dank) await getERC20Balance(dank, 'dank') 

  const daidankUni = store.get('daidankUniObject')
  if (daidankUni) await getERC20Balance(daidankUni, 'daidank') 

  const daideurUni = store.get('daideurUniObject')
  if (daideurUni) await getERC20Balance(daideurUni, 'daideur') 
  
}

export const getChaiTotalSupply = async function() {
  const { store } = this.props
  // const web3 = store.get('web3')
  const chai = store.get('chaiObject')
  if (!chai) return
  // const chaiTotalSupplyRaw = await chai.methods.totalSupply().call()
  const chaiTotalSupplyRaw = '10000000'
  const chaiTotalSupplyDecimal = new WadDecimal(chaiTotalSupplyRaw)
  store.set('chaiTotalSupply', toDai.bind(this)(chaiTotalSupplyDecimal))
}

// TODO reformat
// Gets ALL relevant total supplies 
export const getDeurTotalSupply = async function() {
  const { store } = this.props
  // const web3 = store.get('web3')
    
  const getERC20TotalSupply = async (contract, name) => {
    const supplyRaw = await contract.methods.totalSupply().call()   
    const supplyDecimal = new WadDecimal(supplyRaw)
    store.set(name + 'TotalSupplyRaw', supplyRaw)
    store.set(name + 'TotalSupplyDecimal', supplyDecimal)
    store.set(name + 'TotalSupply', supplyDecimal.div('1e18').toFormat(3)) 
    //console.log(balanceDecimal.div('1e18').toFormat(5)) 
  }
  
  const deur = store.get('deurObject')
  if (deur) await getERC20TotalSupply(deur, 'deur')     
  
  const dank = store.get('dankObject')
  if (dank) await getERC20TotalSupply(dank, 'dank') 

  const daidankUni = store.get('daidankUniObject')
  if (daidankUni) await getERC20TotalSupply(daidankUni, 'daidank') 

  const daideurUni = store.get('daideurUniObject')
  if (daideurUni) await getERC20TotalSupply(daideurUni, 'daideur') 
 
}

export const toDeur = function(daiAmount) {
  const daiDecimal = daiAmount ? new WadDecimal(daiAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('der')) return
  const deurDecimal = new WadDecimal(store.get('der'))
  return toFixed(daiDecimal.div(deurDecimal),5)
}

export const toChai = function(daiAmount) {
  const daiDecimal = daiAmount ? new WadDecimal(daiAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('chi')) return
  const chiDecimal = new WadDecimal(store.get('chi'))
  return toFixed(daiDecimal.div(chiDecimal),5)
}


export const toDai = function(deurAmount) {
  const deurDecimal = deurAmount ? new WadDecimal(deurAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('der')) return
  const derDecimal = new WadDecimal(store.get('der'))
  return derDecimal.mul(deurDecimal)
}


export const setupContracts = function () {
    const { store } = this.props
    const web3 = store.get('web3')


    //Manager
    store.set('mgrObject', new web3.eth.Contract(managerABI, config.MANAGER))
    // ERC20
    store.set('potObject', new web3.eth.Contract(potABI, config.MCD_POT))
    store.set('daiObject', new web3.eth.Contract(erc20, config.MCD_DAI))
    store.set('chaiObject', new web3.eth.Contract(chaiABI, config.CHAI))
    store.set('deurObject', new web3.eth.Contract(erc20, config.DEUR))
    store.set('dankObject', new web3.eth.Contract(erc20, config.DANK))
    // Uniswap Pools
    store.set('daidankUniObject', new web3.eth.Contract(UniPoolABI, config.UNIV2P_DAI_DANK))
    store.set('daideurUniObject', new web3.eth.Contract(UniPoolABI, config.UNIV2P_DAI_DEUR))
    // Internal Staking Pools
    store.set('dankpoolObject', new web3.eth.Contract(poolABI, config.DANKPOOL))
    store.set('deurpoolObject', new web3.eth.Contract(poolABI, config.DEURPOOL))
}

export const getData = async function() {
    getPotDsr.bind(this)()
    // getPotChi.bind(this)()
    getPotDer.bind(this)()
    getDaiAllowance.bind(this)()
    getDeurAllowance.bind(this)()
    getDaiBalance.bind(this)()
    getChaiBalance.bind(this)()
    getDeurBalance.bind(this)()
    getChaiTotalSupply.bind(this)()
    getDeurTotalSupply.bind(this)()
}

const secondsInYear = WadDecimal(60 * 60 * 24 * 365)

export const initBrowserWallet = async function(prompt) {
    const store = this.props.store

    store.set('walletLoading', true)
    if (!localStorage.getItem('walletKnown') && !prompt) return

    let web3Provider

    // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
    if (window.ethereum) {
        web3Provider = window.ethereum
        try {
            // Request account access
            await window.ethereum.enable()
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }

        window.ethereum.on('chainChanged', () => {
            initBrowserWallet.bind(this)()
        })

    }
    // Legacy dApp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, display err
    else {
        console.log("Please install MetaMask!")
        store.set('web3Failure', true)
        return
    }

    const web3 = new Web3(web3Provider)
    const network = await web3.eth.net.getId()
    store.set('network', network)
    store.set('web3Failure', false)
    store.set('web3', web3)
    const walletType = 'browser'
    const accounts = await web3.eth.getAccounts()
    localStorage.setItem('walletKnown', true)
    store.set('walletLoading', false)
    store.set('walletAddress', accounts[0])
    store.set('walletType', walletType)
    setupContracts.bind(this)()
    getData.bind(this)()
}

export default {
    initBrowserWallet,
    toChai,
    toDai,
    toDeur
}
