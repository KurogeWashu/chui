import { } from '../utils/web3Utils';

export const exit = async function() {
    const { store } = this.props
    // const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const exitAmount = store.get('exitAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    return deur.methods.burn(walletAddress, exitAmount.toFixed()).send({from: walletAddress})
}

export const join = async function() {
    const { store } = this.props
    // const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const dai = store.get('daiObject')
    const joinAmount = store.get('joinAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('daiAllowance')
    if (joinAmount.cmp(allowance)>0) {
      return dai.methods.approve(deur.options.address, "-1")
        .send({from: walletAddress})
        .then(function () {
          return deur.methods.join(walletAddress, joinAmount.toFixed()).send({from: walletAddress})
        });
    }
    return deur.methods.join(walletAddress, joinAmount.toFixed()).send({from: walletAddress})
}

export const mint = async function() {
    const { store } = this.props
    // const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const dai = store.get('daiObject')
    const mintAmount = store.get('mintAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('daiAllowance')
    if (mintAmount.cmp(allowance)>0) {
      return dai.methods.approve(deur.options.address, "-1")
        .send({from: walletAddress})
        .then(function () {
          return deur.methods.mint(walletAddress, mintAmount.toFixed()).send({from: walletAddress})
        });
    }
    return deur.methods.mint(walletAddress, mintAmount.toFixed()).send({from: walletAddress})
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
    transfer,
}
