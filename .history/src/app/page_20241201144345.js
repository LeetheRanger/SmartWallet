import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Home() {
    const [walletAddress, setWalletAddress] = useState("0x0c7D7753b8D408BfB051a9965412eB891Af343Ff");
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");

    const contractABI = [
        "function deposit() public payable",
        "function withdraw(uint256 amount) public",
        "function getBalance() public view returns (uint256)",
    ];

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        const signer = providerInstance.getSigner();
        const contractInstance = new ethers.Contract(walletAddress, contractABI, signer);
        setProvider(providerInstance);
        setContract(contractInstance);
    };

    const fetchBalance = async () => {
        if (contract) {
            const bal = await contract.getBalance();
            setBalance(ethers.utils.formatEther(bal));
        }
    };

    useEffect(() => {
        if (contract) fetchBalance();
    }, [contract]);

    const handleDeposit = async () => {
        if (contract && amount) {
            const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
            await tx.wait();
            fetchBalance();
        }
    };

    const handleWithdraw = async () => {
        if (contract && amount) {
            const tx = await contract.withdraw(ethers.utils.parseEther(amount));
            await tx.wait();
            fetchBalance();
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Smart Wallet</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <p>Balance: {balance} ETH</p>
            <input
                type="number"
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
}