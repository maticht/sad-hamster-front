import React, {useEffect, useState} from 'react';
import './walletScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import { formatDistanceToNow, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import axios from 'axios';
import scoreCoin from "../../img/icons/scoreCoin.png";
import {updateWalletHash} from "../../httpRequests/dragonEggApi";
import {Link} from "react-router-dom";

export const WalletScreen = () => {
    const [userData, setUserData] = useState({});
    const { user } = useTelegram();
    const userId = user?.id || '777217409';
    const [transactions, setTransactions] = useState([]);
    const [ETHBalance, setETHBalance] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [totalUSD, setTotalUSD] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [walletHash, setWalletHash] = useState('');
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const handleInputChange = (e) => {
        setWalletHash(e.target.value);
    };

    const handleConnectClick = async () => {
        try {
            const data = await updateWalletHash(userId, walletHash);
            setUserData(data.user);
            setUpdateTrigger(prev => prev + 1);
            console.log('Wallet hash updated successfully', data);
        } catch (error) {
            console.error('Error updating wallet hash', error);
        }
    };

    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
        };
        console.log(user)

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId, updateTrigger]);

    useEffect(() => {
        const ETHBalanceTransactions = async () => {
            const url = `https://explorer.mainnet.aurora.dev/api/v2/addresses/${userData.auroraWalletHash}`;
            try {
                const response = await axios.get(url);
                console.log(response.data.coin_balance)
                setETHBalance(response.data.coin_balance);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        ETHBalanceTransactions();
    }, [userData.auroraWalletHash]);
    useEffect(() => {
        const ETHBalanceTransactions = async () => {
            const url = `https://explorer.mainnet.aurora.dev/api/v2/addresses/${userData.auroraWalletHash}/token-balances`;
            try {
                const response = await axios.get(url);
                console.log(response.data)
                setTokens(response.data);
                response.data.forEach((token) => {
                    const tokenValueUSD = (parseFloat(token.value) / Math.pow(10, token.token.decimals)) * token.token.exchange_rate;
                    setTotalUSD(prevTotalUSD => prevTotalUSD + tokenValueUSD);
                });
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        ETHBalanceTransactions();
    }, [userData.auroraWalletHash]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const url = `https://explorer.mainnet.aurora.dev/api/v2/addresses/${userData.auroraWalletHash}/transactions?filter=&page=1&offset=10`;
            try {
                const response = await axios.get(url);
                console.log(response.data.items)
                const transactionsData = response.data.items.slice(0, 10);
                setTransactions(transactionsData);
                setTransactionCount(response.data.items.length);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [userData.auroraWalletHash]);

    const formatNumber = (number) => {
        return Number(number).toLocaleString('en-US', { maximumFractionDigits: 20 });
    };

    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);

        const years = differenceInYears(now, date);
        if (years > 0) return `${years}y`;

        const months = differenceInMonths(now, date);
        if (months > 0) return `${months}mo`;

        const days = differenceInDays(now, date);
        if (days > 0) return `${days}d`;

        const hours = differenceInHours(now, date);
        if (hours > 0) return `${hours}h`;

        const minutes = Math.floor((now - date) / (1000 * 60));
        if (minutes > 0) return `${minutes}m`;

        const seconds = Math.floor((now - date) / 1000);
        return `${seconds}s`;
    };

    const truncateHash = (hash, value) => {
        if (!hash) return '';
        return `${hash.slice(0, value)}...${hash.slice(-value)}`;
    };


    return (
        <div className="wallet-screen">
            <div className="profile-container">
                {userData.auroraWalletHash === '' ? (
                    <div className={'wallet-block'}>
                        <div className='wallet-balance-block'>
                            <h2>Connect with Aurora</h2>
                            <div className='profile-info-score'>
                                <p>Score:</p> <b>{userData.score} </b>
                                <img src={scoreCoin} alt="score coin"/>
                                <p>~<b>???</b>$</p>
                            </div>
                            <div className="connection-block">
                                <p>Enter your <b>wallet hash</b> to connect</p>
                                <div className="input-connection-block">
                                    <input
                                        className="connection-input"
                                        placeholder={'0x91F553289C7a0342H...'}
                                        value={walletHash}
                                        onChange={handleInputChange}
                                    />
                                    <button className="input-connect-button" onClick={handleConnectClick}>Connect</button>
                                </div>
                            </div>
                            <p>If you don't have a wallet</p>
                            <div className='wallet-btn-block'>
                                <p className="wallet-connect-text"><b>Create a wallet</b> on the <b>Aurora</b> network
                                </p>
                                <a href="https://auroracloud.dev/pass" target="_blank" rel="noopener noreferrer"
                                   className="wallet-connect-link">
                                    Aurora Pass
                                </a>
                            </div>
                        </div>
                    </div>

                ) : (
                    <div className={'wallet-block'}>
                        {userData && (
                            <div className='wallet-balance-block'>
                                <h2>Wallet</h2>
                                <p><b>{truncateHash(userData.auroraWalletHash, 14)}</b></p>
                                <p>ETH Balance: <b>{(ETHBalance / 1000000000000000000).toFixed(8)} ETH</b></p>
                                <p>USD Balance: <b>${totalUSD.toFixed(2)}</b></p>
                                <div className='profile-info-score'>
                                    <p>Score:</p> <b>{userData.score} </b>
                                    <img src={scoreCoin} alt="score coin"/>
                                    <p>~<b>???</b>$</p>
                                </div>
                                <div className='wallet-btn-block'>
                                    <button className="wallet-disconnect-button" onClick={handleConnectClick}>Disconnect</button>
                                    <a href="https://auroracloud.dev/pass" target="_blank" rel="noopener noreferrer"
                                       className="wallet-disconnect-button">
                                        Aurora Pass
                                    </a>
                                </div>
                            </div>
                        )}
                        {userData && tokens.length !== 0 && (
                            <div className='wallet-info-block'>
                                <div className='wallet-info-values'>
                                    <h2>Tokens</h2>
                                    <p>Your <b>{tokens.length}</b> tokens: </p>
                                </div>
                                <div className='wallet-token-list'>
                                    {tokens.map((token, index) => (
                                        <div className='wallet-token-block' key={index}>
                                            <div className='token-header'>
                                                <h3>{token.token.name}</h3>
                                                <p>Price: <b> ${token.token.exchange_rate}</b></p>
                                            </div>
                                            <div className='token-header-value'>
                                                <p>Quantity:
                                                    <b> {(parseFloat(token.value) / Math.pow(10, token.token.decimals)).toFixed(4)}</b>
                                                </p>
                                                <p>
                                                    Value:
                                                    <b> ${((parseFloat(token.value) / Math.pow(10, token.token.decimals)) * token.token.exchange_rate).toFixed(2)}</b>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {userData && transactions.length !== 0 && (
                            <div className='wallet-transactions-block'>
                                <h2>Transactions</h2>
                                <p>Last <b>10</b> transactions:</p>
                                <div className='wallet-transaction-list'>
                                    {transactions.map((transaction, index) => (
                                        <div className='wallet-transaction-block' key={index}>
                                            <div className='transaction-header'>
                                                <h3>{truncateHash(transaction.hash, 6)}</h3>
                                                <p>{formatRelativeTime(transaction.timestamp, 6)}</p>
                                            </div>
                                            <p><b>Block:</b> {transaction.block}</p>
                                            <div className='transaction-header'>
                                                <p><b> {truncateHash(transaction.from.hash, 6)}</b></p>
                                                <p>To</p>
                                                <p><b>{truncateHash(transaction.to.hash, 6)}</b></p>
                                            </div>
                                            <p><b>Value:</b> {transaction.value / 1000000000000000000} ETH</p>
                                            <p>
                                                <b>Fee:</b> {(transaction.fee.value / 1000000000000000000).toFixed(11)} ETH
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <NavBar/>
            </div>
        </div>
    )
}

export default WalletScreen;