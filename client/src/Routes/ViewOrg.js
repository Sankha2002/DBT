import { useEffect, useState } from "react";
import { connect } from "react-redux";

import Navbar from "../Components/Navbar";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
const Patient = ({ orgContract, web3 }) => {
   // const [data, setData] = useState(null);
    const [buyerData, setBuyerData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const buyer=[];
        const seller=[];

        (async () => {
            let accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            try {
            
                    let buyerorgs = await orgContract.contract.methods
                    .getVerifiedBuyers()
                    .call({ form: accounts[0] });
                let sellerorgs = await orgContract.contract.methods
                    .getVerifiedSellers()
                    .call({ from: accounts[0] });

                    for(var i=0,j=0;i<buyerorgs.length;i++,j++)
                    {
                        if(buyerorgs[i]['role']==="buyer")
                        {
                            buyer.push(buyerorgs[i]['name'],buyerorgs[i]['aadharno'],buyerorgs[i]['addr'],buyerorgs[i]['con'],buyerorgs[i]['typ'],buyerorgs[i]['landdetails'],buyerorgs[i]['fertilizersused'],buyerorgs[i]['noofcrops'])
                        }
                    }

                    for(var i=0,j=0;i<sellerorgs.length;i++,j++)
                    {
                        if(sellerorgs[i]['role']==="seller")
                        {
                            seller.push(sellerorgs[i]['name'],sellerorgs[i]['email'],sellerorgs[i]['addr'],sellerorgs[i]['con'],sellerorgs[i]['gstno'],sellerorgs[i]['typ'])
                        }
                    }
                    console.log(buyerorgs)
                    console.log(sellerorgs)

                    const organization1=[]
                    while(buyer.length) organization1.push(buyer.splice(0,8))
                    setBuyerData(organization1);

                    const organization2=[]
                    while(seller.length) organization2.push(seller.splice(0,6))
                    setSellerData(organization2);
                    
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        })();

        return () => {};
    }, [orgContract]);
    return (
        <>
            <Navbar />
            <div className="container my-4">

                <div className="card">
                    <div className="card-body">
                        
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {buyerData && buyerData.length === 0 && (
                            <p className="m-0">There is no farmer added yet!!</p>
                        )}
                        {buyerData && buyerData.length !== 0 &&  (
                            <>
                            <h3>Farmer Details</h3>
                        <hr/>
                            <center>
                                <Grid
                                    data={buyerData}
                                    columns={[
                                        
                                        "Farmer Name",
                                        "Aadhar No.",
                                        "Address",
                                        "Contact No",
                                        "Type",
                                        "Land Own",
                                        "Fertilizers Required",
                                        "No. of crops grown annually"
                                    ]}
                                    search={true}
                                    pagination={{
                                        enabled: true,
                                        limit: 6,
                                    }}
                                />
                                </center>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="container my-4">

            <div className="card">
                <div className="card-body">
                    
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {sellerData && sellerData.length === 0 && (
                        <p className="m-0">There is no seller added yet!!</p>
                    )}
                    {sellerData && sellerData.length !== 0 &&  (
                        <>
                        <h3>Seller Details</h3>
                    <hr/>
                        <center>
                            <Grid
                                data={sellerData}
                                columns={[
                                    
                                    "Seller Name",
                                    "Email",
                                    "Address",
                                    "Contact No",
                                    "GST No.",
                                    "Type"
                                ]}
                                search={true}
                                pagination={{
                                    enabled: true,
                                    limit: 6,
                                }}
                            />
                            </center>
                        </>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        orgContract: state.contractReducer,
        web3: state.web3Reducer,
    };
};
export default connect(mapStateToProps)(Patient);
