import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import EthereumBackend from './ethereumBack';

const WalletComponent = () => {
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');

    useEffect(() => {
        const loadBalance = async () => {
            const balanceInWei = await EthereumBackend.getBalance();
            const balanceInEther = Web3.utils.fromWei(balanceInWei, 'ether');
            setBalance(balanceInEther);
        };
    
        loadBalance();
    }, []);

    const handleSend = async () => {
        try {
            setTransactionStatus('전송 중...');
            await EthereumBackend.sendEther(receiver, amount);
            setTransactionStatus('전송 완료!');
            setReceiver('');
            setAmount('');           
            const updatedBalance = await EthereumBackend.getBalance();
            setBalance(updatedBalance);
        } catch (error) {
            setTransactionStatus('전송 실패: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Wallet Info</h2>
            <p>잔액: {balance.toString()} ETH</p>
            <input 
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="받는 사람 주소"
            />
            <input 
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="보낼 이더량"
            />
            <button onClick={handleSend}>송금</button>
            <p>{transactionStatus}</p>
        </div>
        
    );
};

export default WalletComponent;
