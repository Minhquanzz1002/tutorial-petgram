import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home-container/home/Home'
import PetDetails from './components/home-container/pet-details/PetDetails'
import CreatePet from './components/create-post/CreatePet'
import Profile from './components/home-container/profile/Profile'

import Web3 from 'web3'
import MyPet from './abis/Pet.json'
import { useState } from 'react'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import logo from './images/metamask.png'


function App() {
  // Add variables
  const [account, setAccount] = useState('')
  const [contractData, setContractData] = useState('')
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  };

  // connect to metamask and reads it into the app using web3
  const loadWeb3 = async () => {
    // detect the Ethereum provider
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!',
      )
    }
  }

  const getContract = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId()    // 80001
    const networkData = MyPet.networks[networkId]

    if (networkData) {
      // Application Binary Interface is the json format of the smart contract that contains its functions and methods
      const abi = MyPet.abi
      const address = MyPet.networks[networkId].address       // get address contract
      const myContract = new web3.eth.Contract(abi, address)
      setContractData(myContract)
    } else {
      window.alert(
        'Contract is not deployed to the detected network. Connect to the correct network!',
      )
    }
  }

  const connectWallet = async () => {
    await loadWeb3()
    await getContract()
    setOpen(false)
  }

  return (
    <Router>
      <div className="cl">
        <Navbar account={account} connectWallet={connectWallet} />
        
        {/* Start Modal */}
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableEnforceFocus
          disablePortal
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "2rem"}}>
              SELECT WALLET
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button onClick={connectWallet} style={{fontWeight: "bold", border: '1px solid blue'}}>
                <img alt="Metamask" src={logo} style={{margin: "0 20px 0 0"}} />
                Connect Metamask
                </Button>
            </Typography>
          </Box>
        </Modal>
        {/* End Modal */}

        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/create-pet">
            <CreatePet account={account} />
          </Route>
          <Route path="/pet-details/:petId">
            <PetDetails account={account} contractData={contractData} />
          </Route>
        </Switch>

        <Switch>
          <Route exact path="/profile">
            <Profile account={account} contractData={contractData}/>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
