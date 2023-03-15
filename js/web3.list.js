var currentAddr;
var networkID = 0;
var daoContract = null;
var web3 = null;
var web3Temp = null;

var boolContentLoaded = false;

window.addEventListener('load', () => {    //Reset
    currentAddr = null;
    daoContract = null;
    web3 = null;
    web3Temp = null;

    boolContentLoaded = false;

    Connect();
    mainContractInfo();
})



async function mainContractInfo() {
    if (NETID == 1) {
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + INFURA_ID));
    } else if (NETID == 42) {
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + INFURA_ID));
    } else {
        web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    }
    daoContract = await new web3.eth.Contract(ABI_DAO, ADDRESS_DAO);
    update();
}

async function Connect() {
    if (window.ethereum) {
        web3Temp = new Web3(window.ethereum)
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            currentAddr = accounts[0]
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
            runAPP()
            return
        } catch (error) {
            console.error(error)
        }
    }
}


async function runAPP() {
    networkID = await web3Temp.eth.net.getId()
    if (networkID == NETID) {
        web3 = web3Temp;
        daoContract = await new web3.eth.Contract(ABI_DAO, ADDRESS_DAO);

        await getCurrentWallet();
        update();
    } else {
        $("#btn-connect-txt").text("Wrong network!");

        if (window.ethereum) {
            const data = [{
                chainId: '0x1',
            }]
            /* eslint-disable */
            const tx = await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: data }).catch()
            if (tx) {
                console.log(tx)
            }
        }
    }
}


$("#btn-connect-metamask").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Metamask first");
    }
})

$("#btn-connect-trust").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Trust wallet and open the website on Trust/DApps");
    }
})


$("#btn-connect-wlconnect").click(async() => {
    var WalletConnectProvider = window.WalletConnectProvider.default;
    var walletConnectProvider = new WalletConnectProvider({
        infuraId: INFURA_ID,
        rpc: {
            1: "https://mainnet.infura.io/v3/" + INFURA_ID,
        },
        chainId: 1,
    });
    await walletConnectProvider.enable();

    web3Temp = new Web3(walletConnectProvider);
    var accounts = await web3Temp.eth.getAccounts();
    currentAddr = accounts[0];
    var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
    $("#connected-address").text(connectedAddr);
    $("#connected-address-area").css("display", "inline");
    $("#btn-connect").css("display", "none");

    walletConnectProvider.on("chainChanged", (chainId) => {
        window.location.reload();
    });
    walletConnectProvider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        window.location.reload();
    });
    walletConnectProvider.on("accountsChanged", (chainId) => {
        window.location.reload();
    });

    runAPP()
})


async function getCurrentWallet() {
    var accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        currentAddr = accounts[0];
        console.log(currentAddr);

        var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
        $("#connected-address").text(connectedAddr);
        $("#connected-address-area").css("display", "inline");
        $("#btn-connect").css("display", "none");
    }
}

var finalProposalUp = 0;
var finalProposalDown = 0;
var finalProposalNeutral = 0;


async function updateParameters() {

    if (daoContract) {
        var noProposal = 0;

        await daoContract.methods.noProposal().call().then(res => {
            noProposal = parseInt(res);
            console.log("Total: " + noProposal);
        })

        var listProposal = "";

        if(noProposal > 0){
            await daoContract.methods.getStatusOfLastProposal().call().then(res => {
                finalProposalUp = res[0]/1e24;
                finalProposalDown = res[1]/1e24;
                finalProposalNeutral = res[2]/1e24;
            })
        }

        for (let i = noProposal; i > 0; i--) {
            await daoContract.methods.proposalInfo(i).call().then(res => {
                var proposer = res.proposer[0] + res.proposer[1] + res.proposer[2] + res.proposer[3] + res.proposer[4] + res.proposer[5] + '...' + res.proposer[res.proposer.length - 6] + res.proposer[res.proposer.length - 5] + res.proposer[res.proposer.length - 4] + res.proposer[res.proposer.length - 3] + res.proposer[res.proposer.length - 2] + res.proposer[res.proposer.length - 1];
                var noVoteUp = res.finalNoVoteUp/1e24;
                var noVoteDown = res.finalNoVoteDown/1e24;
                var noVoteNeutral = res.finalNoNeutral/1e24;
                var finalResult = res.finalResult;
                var end = res.end;

                var status = "Closed";

                // Check latest proposal
                if(i == noProposal && finalResult == 0){
                    console.log("Last proposal");
                    noVoteUp        = finalProposalUp
                    noVoteDown      = finalProposalDown
                    noVoteNeutral   = finalProposalNeutral;
                    if(Date.now()/1000 <= parseFloat(end)){
                        status = "On going";
                    }
                }

                var totalVote = noVoteUp + noVoteDown + noVoteNeutral;
                var pVoteUp = 0.00;
                var pVoteDown = 0.00;
                var pVoteNeutral = 0.00;

                if(totalVote != 0){
                    pVoteUp = (noVoteUp * 100 / totalVote);
                    pVoteDown = (noVoteDown * 100 / totalVote);
                    pVoteNeutral = (noVoteNeutral * 100 / totalVote);
                }

                listProposal += `
                <li class="list-group-item border-0 flex-column align-items-start ps-0 py-0 mb-3">
                  <div class="checklist-item checklist-item-primary ps-2 ms-3">
                    <div class="d-flex align-items-center">
                      <div class="form-check">
                        <img src="https://cdn.stamp.fyi/avatar/eth:${res.proposer}?s=36" class="rounded-full" alt="avatar" style="width: 25px; height: 25px; min-width: 18px;">
                      </div>
                      <h6 class="mb-0 text-dark font-weight-bold text-sm">${proposer}</h6>
                      <div class="dropstart float-lg-end ms-auto pe-0">
                        <a href="javascript:;" class="cursor-pointer" id="dropdownTable2" data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <i class="fa fa-ellipsis-h text-secondary" aria-hidden="true"></i>
                        </a>
                        <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable2"
                          style="">
                          <li><a class="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                          <li><a class="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                          <li><a class="dropdown-item border-radius-md" href="javascript:;">Something else here</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="d-flex align-items-center ms-4 mt-3 ps-1">
                      <div>
                        <p class="text-xs mb-0 text-secondary font-weight-bold"> ${res.name}</p>
                        <span class="text-xs font-weight-bolder"> ${res.details}</span>
                      </div>
                      <div class="ms-auto">
                        <p class="text-xs mb-0 text-secondary font-weight-bold">For </p>
                        <span class="text-xs font-weight-bolder">${noVoteUp.toFixed(1)}M SUZUME</span>
                        <span class="text-xs font-weight-bolder">${pVoteUp.toFixed(2)}%</span>
                      </div>
                      <div class="mx-auto">
                        <p class="text-xs mb-0 text-secondary font-weight-bold">Against</p>
                        <span class="text-xs font-weight-bolder">${noVoteDown.toFixed(1)} SUZUME</span>
                        <span class="text-xs font-weight-bolder">${pVoteDown.toFixed(2)}%</span>
                      </div>
                      <div class="mx-auto">
                        <p class="text-xs mb-0 text-secondary font-weight-bold">Abstain</p>
                        <span class="text-xs font-weight-bolder">${noVoteNeutral.toFixed(1)} SUZUME</span>
                        <span class="text-xs font-weight-bolder">${pVoteNeutral.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <hr class="horizontal dark mt-4 mb-0">
                </li>

`

                $("#proposals").html(listProposal);
            })
        }
    }
}

function update() {
    console.log("Update");
    if(boolContentLoaded == false){
        boolContentLoaded = true;
        updateParameters();
    }
}

$("#btn-claim").click(() => {
    try {
        if (daoContract && currentAddr != null && currentAddr != undefined) {
            daoContract.methods.claim().send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})