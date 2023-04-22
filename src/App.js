import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Grocery from "./build/contracts/Grocery.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      setWeb3(web3);

      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      const networkId = await web3.eth.net.getId
      const deployedNetwork = Grocery.networks[networkId];
      const contract = new web3.eth.Contract(
        Grocery.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(contract);
    
      const itemCount = await contract.methods.itemCount().call();
      const items = await Promise.all(
        Array(parseInt(itemCount))
          .fill()
          .map((_, index) => contract.methods.items(index + 1).call()),
      );
      setItems(items);
    };
    
    init();
  }, []);

  const addItem = async (event) => {
  event.preventDefault();
  await contract.methods.addItem(itemName, web3.utils.toWei(itemPrice)).send({ from: accounts[0] });
  setItems([
  ...items,
  {
  name: itemName,
  price: itemPrice,
  purchased: false,
  },
  ]);
  setItemName("");
  setItemPrice("");
  };
  
  const purchaseItem = async (id, price) => {
  await contract.methods.purchaseItem(id).send({ from: accounts[0], value: price });
  const updatedItems = [...items];
  updatedItems[id - 1].purchased = true;
  setItems(updatedItems);
  };
  
  return (
  <div className="App">
  <h1>Grocery List</h1>
  <form onSubmit={addItem}>
  <input type="text" placeholder="Item Name" value={itemName} onChange={(event) => setItemName(event.target.value)} required />
  <input type="number" placeholder="Item Price" value={itemPrice} onChange={(event) => setItemPrice(event.target.value)} required />
  <button type="submit">Add Item</button>
  </form>
  <table>
  <thead>
  <tr>
  <th>Name</th>
  <th>Price</th>
  <th>Purchased</th>
  <th>Action</th>
  </tr>
  </thead>
  <tbody>
  {items.map((item, index) => (
  <tr key={index}>
  <td>{item.name}</td>
  <td>{web3.utils.fromWei(item.price, "ether")} Ether</td>
  <td>{item.purchased ? "Yes" : "No"}</td>
  {!item.purchased && (
  <td>
  <button onClick={() => purchaseItem(index + 1, item.price)}>Purchase</button>
  </td>
  )}
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  );
  }
  
  export default App;