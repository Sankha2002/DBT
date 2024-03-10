import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navbar from "../Components/Navbar";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { h } from "gridjs";
import { ToastContainer, toast } from "react-toastify";
const Request = ({ contract, web3 }) => {
    const [buyerData, setBuyerData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            let accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            try {
                let buyerOrgs = await contract.contract.methods
                    .getUnverifiedBuyers()
                    .call({ from: accounts[0] });
                let sellerOrgs = await contract.contract.methods
                    .getUnverifiedSellers()
                    .call({ from: accounts[0] });
                setBuyerData(buyerOrgs);
                setSellerData(sellerOrgs);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        })();
    }, [contract]);

    const approvedBuyer = async (address) => {
        let toastOption = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };
        if (!web3.web3.utils.isAddress(address)) {
            toast.error("Invalid address error", toastOption);
            return;
        }
        let accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        await toast.promise(
            contract.contract.methods
                .verifyBuyers(address)
                .send({ from: accounts[0] }),

            {
                pending: "Waiting...",
                success: {
                    render({ data }) {
                        // let message =
                        //     data.events.verifyBuyers.returnValues._message;
                        setBuyerData((state) =>
                            state.filter((item) => item.id !== address)
                        );
                        return "message";
                    },
                },
                error: {
                    render({ err }) {
                        return "Error : " + err.message;
                    },
                },
            }
        );
    
    };

    const approvedSeller = async (address) => {
        let toastOption = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };
        if (!web3.web3.utils.isAddress(address)) {
            toast.error("Invalid address error", toastOption);
            return;
        }
        let accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        await toast.promise(
            contract.contract.methods
                .verifySellers(address)
                .send({ from: accounts[0] }),

            {
                pending: "Waiting...",
                success: {
                    render({ data }) {
                        // let message =
                        //     data.events.verifyBuyers.returnValues._message;
                        setSellerData((state) =>
                            state.filter((item) => item.id !== address)
                        );
                        return "message";
                    },
                },
                error: {
                    render({ err }) {
                        return "Error : " + err.message;
                    },
                },
            }
        );
    
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <div className="card">
                    <div className="card-body" style={{ backgroundColor: '#E5E3E3' }}>
                        <h5 className="card-title">New Organization Requests</h5>
                        <hr />
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {buyerData && buyerData.length !== 0 && (
                            <div>
                                <h6>Buyer Requests</h6>
                                <Grid
                                    data={buyerData}
                                    columns={[
                                        {
                                            data: (row) => row.name,
                                            name: "Name",
                                        },
                                        {
                                            data: (row) => row.aadharno,
                                            name: "Aadhar no",
                                        },
                                        {
                                            data: (row) => row.addr,
                                            name: "Address",
                                        },
                                        // {
                                        //     data: (row) => row.email,
                                        //     name: "Email Address",
                                        // },
                                        {
                                            data: (row) => row.con,
                                            name: "Contact Number",
                                        },
                                        {
                                            data:(row)=>row.typ,
                                            name:"Type",
                                        },
                                        {
                                            data: (row) => row.landdetails,
                                            name: "Land Own",
                                        },
                                        {
                                            data: (row) => row.fertilizersused,
                                            name: "Fertilizers Required",
                                        },
                                        {
                                            data: (row) => row.noofcrops,
                                            name: "No. of Crops",
                                        },
                                        {
                                            data: (row) => row.id,
                                            name: "Actions",
                                            formatter: (data) => {
                                                return h(
                                                    "button",
                                                    {
                                                        className:
                                                            "border rounded-md text-white btn btn-primary",
                                                        onClick: () =>
                                                            approvedBuyer(data),
                                                
                                                    },
                                                "Approve"
                                            )
                                        },
                                    },
                                    ]}
                                    search={false}
                                    pagination={{
                                        enabled: true,
                                        limit: 5,
                                    }}
                                />
                            </div>
                        )}
                        {sellerData && sellerData.length !== 0 && (
                            <div>
                                <h6>Seller Requests</h6>
                                <Grid
                                    data={sellerData}
                                    columns={[
                                        {
                                            data: (row) => row.name,
                                            name: "Name",
                                        },
                                        {
                                            data: (row) => row.addr,
                                            name: "Address",
                                        },
                                        {
                                            data: (row) => row.email,
                                            name: "Email Address",
                                        },
                                        {
                                            data: (row) => row.gstno,
                                            name: "GST No.",
                                        },
                                        {
                                            data: (row) => row.con,
                                            name: "Contact Number",
                                        },
                                        {
                                            data:(row)=>row.typ,
                                            name:"Type",
                                        },
                                        {
                                            data: (row) => row.id,
                                            name: "Actions",
                                            formatter: (data) => {
                                                return h(
                                                    "button",
                                                    {
                                                        className:
                                                            "border rounded-md text-white btn btn-primary",
                                                        onClick: () =>
                                                            approvedSeller(data),
                                                
                                                    },
                                                    "Approve"
                                                );
                                            },
                                        },
                                    ]}
                                    search={false}
                                    pagination={{
                                        enabled: true,
                                        limit: 5,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        contract: state.contractReducer,
        web3: state.web3Reducer,
    };
};
export default connect(mapStateToProps)(Request);