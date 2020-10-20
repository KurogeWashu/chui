import {  } from '../utils/web3Utils';
const log = x => console.log(x)


export const exit = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const mgr = store.get('mgrObject')
    const exitAmount = store.get('exitAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('deurAllowance')
    console.log(walletAddress)
    const exitBN = new web3.utils.BN(exitAmount.mul('1e18').toString()) 
    console.log(exitAmount.toString(), allowance.toString());
    if (exitAmount.cmp(allowance)>0) {
      await deur.methods.approve(mgr.options.address, exitBN)
        .send({from: walletAddress})
    }
    return mgr.methods.swapdEurtoDAI(exitBN)
              .send({from: walletAddress})
              .once('transactionHash', log) 
              .on('error', log)
              .catch(e => log)
     
}

export const join = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const dai = store.get('daiObject')
    const mgr = store.get('mgrObject')
    const joinAmount = store.get('joinAmount')
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('daiAllowance')
//    const joinBN = new web3.utils.BN(joinAmount.mul('1e18').toString()) 
    console.log(joinAmount)
    const joinBN = web3.utils.toWei(joinAmount.toString(), 'ether')
    console.log(joinAmount.toString(), allowance.toString());
    if (joinAmount.cmp(allowance)>0) {
      await dai.methods.approve(mgr.options.address, joinBN)
        .send({from: walletAddress})
    }
    return mgr.methods.swapDAItodEur(joinBN)
              .send({from: walletAddress})
              .once('sending', log)
              .once('sent', log)
              .once('transactionHash', log) 
              .once('receipt', log)
              .on('error', log)
              .then(() => log("done"))
}

export const mint = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const mintAmount = store.get('mintAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    console.log(`${walletAddress} mints ${mintAmount}`)
    // might need to add confirmation events to display notifications and whatnot 
    // then update balance etc
    return deur.methods.mint(walletAddress, mintAmount.toFixed()).send(
        {from: walletAddress,
        value: 0,
        gasPrice: web3.utils.toWei("11", "gwei"), //not needed?
        //gas: 500000 // Gas limit??
              })
}

export const stake = async function() {
    log("staking.. not coded yet")
    const { store } = this.props
    // const web3 = store.get('web3')
    const pool = store.get('poolObject')
    const stakeAmount = store.get('stakeAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('poolAllowance') // which pool tho
    if (stakeAmount.cmp(allowance)>0) {
      return pool.methods.approve(pool.options.address, "-1")
        .send({from: walletAddress})
        .then(function () {
          return pool.methods.stake(walletAddress, stakeAmount.toFixed()).send({from: walletAddress})
        });
    }
    return pool.methods.stake(walletAddress, stakeAmount.toFixed()).send({from: walletAddress})
}

export const transfer = async function() {
    const { store } = this.props
    // const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const transferAmount = store.get('transferAmount').mul(10**18)
    const transferAddress = store.get('transferAddress')
    const walletAddress = store.get('walletAddress')
    return deur.methods.transfer(transferAddress, transferAmount.toFixed()).send({from: walletAddress})
}

export default {
    join,
    exit,
    mint,
    stake,
    transfer,
}
