import "./App.css";
import Banner from "./components/Banner";
import { useState, useEffect } from "react";

function App() {
    const url =
        "https://andromeda-explorer.metis.io/api?module=account&action=txlist&address=";

    const [gas, setGas] = useState(0);
    const [gasPrice, setGasPrice] = useState(0);
    const [nbTxs, setNbTxs] = useState(0);
    const [metisPrice, setMetisPrice] = useState(0);
    const [ethPrice, setEthPrice] = useState(0);
    const [token, setToken] = useState(0);

    const totalGas = (array) => {
        let total = 0;
        array.forEach((element) => (total += parseInt(element.gasUsed)));
        return total;
    };

    const avgGasPrice = (array) => {
        let total = 0;
        const nb = array.length;
        array.forEach((element) => (total += parseInt(element.gasPrice)));
        return (total / nb / 1e9).toFixed(1);
    };

    //Wallet integration
    const connectWallet = () => {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((accounts) => setAddress(accounts[0]));
    };
    const [address, setAddress] = useState(null);
    useEffect(() => {
        if (window.ethereum) {
            console.log("Wallet detected");
            connectWallet();
        }
    }, []);

    //Adromeda Explorer
    useEffect(() => {
        fetch(url + address)
            .then((response) => response.json())
            .then((data) => {
                const gas = totalGas(data.result);
                const price = avgGasPrice(data.result);
                setGas(gas);
                setGasPrice(price);
                setNbTxs(data.result.length);
                setToken((gas * price) / 1e9);
            });
    }, [address]);

    //Token Prices
    useEffect(() => {
        fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,metis-token&vs_currencies=usd"
        )
            .then((response) => response.json())
            .then((data) => {
                setMetisPrice(parseFloat(data["metis-token"]["usd"]));
                setEthPrice(parseFloat(data["ethereum"]["usd"]));
            });
    }, []);

    return (
        <div>
            <body>
                <Banner
                    btnText={
                        address
                            ? (
                                  address.slice(0, 5) +
                                  "..." +
                                  address.slice(-6, -1)
                              ).toUpperCase()
                            : "Connect"
                    }
                    btnOnClick={connectWallet}
                />
                <div className="content">
                    <p>
                        You've spent{" "}
                        <span className="accent">
                            <img
                                src="/assets/logo.svg"
                                alt="metis-logo"
                                id="metis-logo"
                            />
                            {token.toFixed(3)}
                        </span>{" "}
                        on gas.<br></br> Right now, that's{" "}
                        <span className="accent">
                            ${(token * metisPrice).toFixed(2)}
                        </span>
                        .
                    </p>
                    <p>
                        You used{" "}
                        <span className="accent">
                            {(gas / 1e6).toFixed(3)} million
                        </span>{" "}
                        gas to send <span className="accent">{nbTxs}</span>{" "}
                        transactions, with an average price of{" "}
                        <span className="accent">{gasPrice}</span> gwei.
                    </p>
                    <p>
                        On Ethereum, that same gas would have cost{" "}
                        <span className="accent">
                            ${(token * ethPrice).toFixed(2)}
                        </span>
                        .
                    </p>
                </div>
            </body>
        </div>
    );
}

export default App;
