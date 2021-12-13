import React, {useEffect, useState} from 'react';
import {ethers} from "ethers";
import ers20abi from './erc20.abi.json'
import './App.css'

const App = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [walletText, setWalletText] = useState('Connect wallet')
    const [balanceError, setBalanceError] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [userInfo, setUserinfo] = useState('')
    const [value, setValue] = useState('')
    const [chainId, setChainId] = useState(null)
    const [account, setAccount] = useState('')
    const contractAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'


    const handleConnectWallet = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then((result) => {
                    setWalletText('Wallet connected')
                    changeAccount(result[0])
                    setIsConnected(true)
                });
            window.ethereum.request({method: 'eth_chainId'})
                .then((result) => {
                    changeNetwork(result)
                });
        } else {
            setErrorMessage('Error. Be sure that MetaMask is installed')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        setUserinfo(data.get('address'))
    }

    const changeAccount = (newAccount) => {
        setAccount(newAccount)
    }

    const changeNetwork = (chainId) => {
        setChainId(chainId)
    }

    if (userInfo) {
        const getBalance = async () => {
            const provider = await new ethers.providers.Web3Provider(window.ethereum)
            const erc20 = await new ethers.Contract(contractAddress, ers20abi, provider)
            try {
                const balance = await erc20.balanceOf(userInfo)
                const currentBalance = await parseFloat(ethers.utils.formatEther(balance));
                setValue(currentBalance)
                console.log(currentBalance)
            } catch (e) {
                setBalanceError('Address not found. Please check and try again')
            } finally {

            }
        }
        getBalance()
    }

    useEffect(() => {
        window.ethereum.on('chainChanged', changeNetwork)
        window.ethereum.on('accountsChanged', changeAccount)
        return () => {
            if (isConnected) {
                window.ethereum.removeListener = () => ('chainChanged', changeNetwork)
                window.ethereum.removeListener('accountsChanged', changeAccount)
            }
        }
    }, [isConnected])


    return (
        <div>
            <header className='header'>
                <h1>Metamask & WEB3</h1>
                <div className='connect-wallet'>
                    <button className='button' onClick={handleConnectWallet}>{walletText}</button>
                </div>
            </header>
            <div className='main'>
                <div className='user-info'>
                    {account && <h5>Address: {account}</h5>}
                    {account && <h5>Network id: {chainId}</h5>}
                </div>
                <div className="balance-box">
                    <form onSubmit={handleSubmit}>
                        <input type="text"
                               placeholder='Enter wallet address'
                               name='address'
                               autoComplete='off'
                               className='input'
                               required={true}
                        />
                        <button type='submit' className='button'>Get balance</button>
                    </form>
                    {!balanceError ? <h3>Result: {value}</h3> : <h3>{balanceError}</h3>}
                    <p>{errorMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default App;