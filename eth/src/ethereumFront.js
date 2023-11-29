import React, { useState, useEffect } from 'react';
import EthereumBackend from './ethereumBack';
import './style.css';

function App() {
    const [receiver, setReceiver] = useState('');
    const [preimage, setPreimage] = useState('');
    const [timelock, setTimelock] = useState('');
    const [amount, setAmount] = useState('');
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const updatedContracts = contracts.map(contract => {
                if (contract.remainingTimelock > 0) {
                    return {
                        ...contract,
                        remainingTimelock: contract.remainingTimelock - 1,
                    };
                }
                return contract;
            });
            setContracts(updatedContracts);
        }, 1000);

        return () => clearInterval(timer);
    }, [contracts]);

    const handleNewContract = async (e) => {
        e.preventDefault();

        try {
            const currentUnixTime = Math.floor(Date.now() / 1000);
            const calculatedTimelock = currentUnixTime + parseInt(timelock, 10); //초 형식의 입력을 unix time으로 변환
            const hashlock = EthereumBackend.web3.utils.sha3(preimage); // preimage의 해시 생성

            const newContractId = await EthereumBackend.newContract(receiver, hashlock, calculatedTimelock, amount);
            console.log('New Contract Created:', newContractId);

            const newContract = {
                id: newContractId,
                remainingTimelock: calculatedTimelock - currentUnixTime,
            };
            setContracts([...contracts, newContract]);
        } catch (error) {
            console.error('Error creating new contract:', error);
        }
    };

    const handleRefund = async (contractId) => {
        try {
            const response = await EthereumBackend.refund(contractId);
            console.log('Refunded:', response);

            // 해당 contractId를 가진 계약을 리스트에서 제거
            const updatedContracts = contracts.filter(contract => contract.id !== contractId);
            setContracts(updatedContracts);
        } catch (error) {
            console.error('Error refunding:', error);
        }
    };

    return (
        <div className="container">
            <h1>HTLC Ethereum Interface</h1>

            <form onSubmit={handleNewContract}>
                <h2>Create New Contract</h2>
                <input type="text" placeholder="Receiver Address" value={receiver} onChange={e => setReceiver(e.target.value)} />
                <input type="text" placeholder="Preimage" value={preimage} onChange={e => setPreimage(e.target.value)} />
                <input type="number" placeholder="Timelock" value={timelock} onChange={e => setTimelock(e.target.value)} />
                <input type="text" placeholder="Amount (ETH)" value={amount} onChange={e => setAmount(e.target.value)} />
                <button type="submit">Create Contract</button>
            </form>

            <div className="contract-list">
                <h2>Created Contracts</h2>
                {contracts.map(contract => (
                    <div className="contract" key={contract.id}>
                        <p>Contract ID: {contract.id}</p>
                        <p>Remaining Timelock: {contract.remainingTimelock} seconds</p>
                        <button onClick={() => handleRefund(contract.id)}>Refund</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
