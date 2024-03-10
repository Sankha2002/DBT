import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ user }) => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div>
                    <Link className="navbar-brand" to="/">
                        DBT
                    </Link>
    
                    <Link className="navbar-brand" to="/profile">
                        Profile
                    </Link>
                            {user && user.role === "admin" && (
                                <>
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/org-request"
                                        >
                                            Approvals
                                        </Link>
                                    
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/view-org"
                                        >
                                            View Users
                                        </Link>
                                    
                                  
                                </>
                            )}
                            {user && user.role == "buyer" && (
                                <>
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/add-patient"
                                        >
                                            Track order
                                        </Link>
                                   
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/view-patient"
                                        >
                                            Order Details
                                        </Link>
                                    

                                        {/* <Link
                                            className="navbar-brand"
                                            to="/search"
                                        >
                                            Search
                                        </Link> */}
                                                          
                                </>
                            )}
                           
                           {user && user.type == "Retailer" && (
                                <>
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/placeorder"
                                        >
                                            Place Order 
                                        </Link>
                                   
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/view-patient"
                                        >
                                            Order Details
                                        </Link>
                                    

                                        <Link
                                            className="navbar-brand"
                                            to="/search"
                                        >
                                            Payment
                                        </Link>
                                                          
                                </>
                            )}


                            {user && user.type == "Wholeseller" && (
                                <>
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/add-patient"
                                        >
                                           View Orders 
                                        </Link>
                                   
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/view-patient"
                                        >
                                            Placed Order Details
                                        </Link>
                                    

                                        <Link
                                            className="navbar-brand"
                                            to="/search"
                                        >
                                            Payment
                                        </Link>
                                                          
                                </>
                            )}


                            {user && user.type == "Manufacturer" && (
                                <>
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/add-patient"
                                        >
                                            Approve Order 
                                        </Link>
                                   
                                    
                                        <Link
                                            className="navbar-brand"
                                            to="/view-patient"
                                        >
                                            Order Details
                                        </Link>
                                    

                                        <Link
                                            className="navbar-brand"
                                            to="/search"
                                        >
                                            Received Payment
                                        </Link>
                                                          
                                </>
                            )}


                        <ul className="navbar-nav">
                            
                            {!user && (
                                <li className="nav-item">
                                    <Link className="navbar-brand" to="/login">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
            </nav>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer,
    };
};

export default connect(mapStateToProps)(Navbar);
