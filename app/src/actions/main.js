import { approve } from '../utils/web3Utils';
const log = x => console.log(x)


export const exit = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const deur = store.get('deurObject')
    const mgr = store.get('mgrObject')
   // const exitAmount = store.get('exitAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')

    const exitAmount = web3.utils.toWei(store.get('exitAmount').toString(), 'ether')
    log(exitAmount.toString())

    approve(deur, mgr.options.address, walletAddress, 
            exitAmount.toString())
        .then(() => 
            mgr.methods.swapdEurtoDAI(exitAmount)
              .send({from: walletAddress})
              .once('transactionHash', log) 
              .on('error', log)
              .catch(e => log)
        )            
     
}


export const join = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const dai = store.get('daiObject')
    const mgr = store.get('mgrObject')
    const joinAmount = store.get('joinAmount')
    const walletAddress = store.get('walletAddress')
    const joinBN = web3.utils.toWei(joinAmount.toString(), 'ether')
    approve(dai, mgr.options.address, walletAddress, joinBN)
        .then(() => {
            return mgr.methods.swapDAItodEur(joinBN)
                .send({from: walletAddress})
                .once('transactionHash', log) 
                .once('receipt', log)
                .then(() => log("done"))
        }).catch(e => log(e.message))

}

export const mint = async function() {
    // TODO OBSOLETE, NOT NEEDED
    const { store } = this.props
    const deur = store.get('deurObject')
    const mintAmount = store.get('mintAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    console.log(`${walletAddress} mints ${mintAmount}`)
    // might need to add confirmation events to display notifications and whatnot 
    // then update balance etc
    return deur.methods.mint(walletAddress, mintAmount.toFixed()).send(
        {from: walletAddress,
      //  value: 0,
      //  gasPrice: web3.utils.toWei("11", "gwei"), //not needed?
        //gas: 500000 // Gas limit??
              })
}

export const stake = async function() {
    const { store } = this.props
    // const web3 = store.get('web3')
    
    const dankStakeAmount = store.get('dankStakeAmount') 
    const deurStakeAmount = store.get('deurStakeAmount') 
    const walletAddress = store.get('walletAddress')

    if (dankStakeAmount && (dankStakeAmount.toString() !== "0")) {

        const pool = store.get('dankpoolObject')
        const daidank = store.get('daidankObject')

        approve(daidank, pool.options.address, walletAddress, 
                dankStakeAmount.mul('1e18').toString())
        .then(() => {
           return pool.methods.stakeTokens(dankStakeAmount.toString())
                              .send({from: walletAddress})
        }).catch(e => log);
    }

    if (deurStakeAmount && (deurStakeAmount.toString() !== "0")) {

        const pool = store.get('deurpoolObject')
        const daideur = store.get('daideurObject')

        approve(daideur, pool.options.address, walletAddress, 
                deurStakeAmount.toString())
        .then(() => {
          return pool.methods.stakeTokens(deurStakeAmount.toString()).send({from: walletAddress})
        })
        .catch(e => log);
    }
}


export const unstake = async function() {
    // TODO MAYBE DO SOME CHECKS?
    
    const { store } = this.props
    // const web3 = store.get('web3')
    
    const walletAddress = store.get('walletAddress')

    const deurpool = store.get('deurpoolObject')
    const dankpool = store.get('dankpoolObject')

    await deurpool.methods.unstakeTokens()
                  .send({from: walletAddress})
                  .catch(e => log);

    await dankpool.methods.unstakeTokens()
                  .send({from: walletAddress})
                  .catch(e => log);
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
    unstake,
    transfer,
}
