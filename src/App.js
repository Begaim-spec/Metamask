import React, {useState} from 'react';
import {ethers} from "ethers";
import ers20abi from './erc20.abi.json'
import './App.css'

const App = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [walletText, setWalletText] = useState('Connect wallet')
    const [userInfo, setUserinfo] = useState('')
    const [value, setValue] = useState('')
    const [account, setAccount] = useState('')
    const contractAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'

    const handleConnectWallet = () => {
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then((result) => {
                    setWalletText('Wallet connected')
                    setAccount(result)
                })
        } else {
            setErrorMessage('Error. Be sure that MetaMask is installed')
        }
    }

    const handleSubmit =  (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        setUserinfo(data.get('address'))
    }

    if (userInfo){
        const getBalance = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const erc20 =  new ethers.Contract(contractAddress, ers20abi, provider)
            try{
                const balance = await erc20.balanceOf(userInfo)
                const currentBalance = await parseFloat(ethers.utils.formatEther(balance));
                setValue(currentBalance)
            } catch (e) {
                alert('Invalid address!')
            }
        }
        getBalance()
    }

    return (
        <div className='App'>
            <div className='connect-wallet'>
                <button className='button' onClick={handleConnectWallet}>{walletText}</button>
                { account && <h3>Your account address is: {account}</h3>}
            </div>
            <form onSubmit={handleSubmit} >
                <input type="text"
                       placeholder='Type wallet address'
                       name='address'
                       autoComplete='off'
                       className='input'
                       required={true}
                />
                <button type='submit' className='button'>Get balance </button>
            </form>
            {value && <h3>Result: {value}</h3>
            }
            <p>{errorMessage}</p>
        </div>
    );
};

export default App;