import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../Navbar';

const firebaseConfig = {
  apiKey: "AIzaSyBlsn1YfQ_KNilp9dA2LG2g3ARPqH55Do0",
  authDomain: "dbttest-ce8bc.firebaseapp.com",
  projectId: "dbttest-ce8bc",
  storageBucket: "dbttest-ce8bc.appspot.com",
  messagingSenderId: "92632875625",
  appId: "1:92632875625:web:d824d71da18fc796e298f8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const PlaceOrder = ({ web3, orgContract }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: {
      value: '',
      validate: 'required|string',
      error: null,
    },
    con: {
      value: '',
      validate: 'required|number',
      error: null,
    },
    order_date: {
      value: '',
      validate: 'required|date',
      error: null,
    },
    productname: {
      value: '',
      validate: 'required|string',
      error: null,
    },
    quantity: {
      value: '',
      validate: 'required|number',
      error: null,
    },
    price: {
      value: '',
      validate: 'required|number',
      error: null,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    } else {
      setFormData({
        ...formData,
        [name]: {
          ...formData[name],
          value: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const phoneNumber = '+91' + formData.con.value;
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha verified');
        },
        defaultCountry: 'IN',
      });

      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      console.log('OTP has been sent');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    let date = new Date(formData.order_date.value);
        function generateOrderId(){

            const id=formData.con.value+formData.order_date.value;
            return id;

        }
        const oid=generateOrderId();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      console.log('User is verified:', user);
      alert('User is verified');

      let address = await window.ethereum.request({
        method: "eth_accounts",
      });

      await orgContract.contract.methods
        .addOrders(
          oid,
          formData.name.value,
          formData.con.value,
          date.getTime(),
          formData.productname.value,
          formData.quantity.value,
          formData.price.value
        )
        .send({ from: address });

      setLoading(false);
      setSuccess('Successfully Placeorder waiting for confirmation!!!');
    } catch (error) {
      setLoading(false);
      setError('Error while Placeordering');
    }
  };

  return (
    <>
      <div className="Placeorder-wrapper">
        <div className="row g-0">
          <div className="col-md-4 left-wrapper"></div>
          <div className="col-md-8 p-3 right-wrapper">
            <form className="Placeorder-form" onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-primary" role="alert">
                  {success}
                </div>
              )}
              <div>
                <h2 className="mb-1">New Order</h2>
                <hr />

                <div className="mb-3">
                  <label className="form-label">
                    <font color="black">Buyer Name</font>
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formData.name.value}
                    name="name"
                    placeholder="Enter name of the organization"
                    className={`form-control ${
                      formData.name.error ? 'is-invalid' : ''
                    }`}
                  />
                  {formData.name.error && (
                    <div className="invalid-feedback">
                      {formData.name.error}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <font color="black">Mobile Number</font>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    value={formData.con.value}
                    name="con"
                    placeholder="Enter mobile number"
                    className={`form-control ${
                      formData.con.error ? 'is-invalid' : ''
                    }`}
                  />
                  {formData.con.error && (
                    <div className="invalid-feedback">
                      {formData.con.error}
                    </div>
                  )}
                </div>


                <div className="col-md-6">
                                <label className="form-label">Order Date</label>
                                <input
                                    type="date"
                                    onChange={handleChange}
                                    value={formData.order_date.value}
                                    name="order_date"
                                    placeholder="Enter Order Date"
                                    className={`form-control ${
                                        formData.order_date.error ? "is-invalid" : ""
                                    }`}
                                />
                                
                                {formData.order_date.error && (
                                    <div className="invalid-feedback">
                                        {formData.order_date.error}
                                    </div>
                                )}
                  </div>


                <div className="mb-3">
                  <label className="form-label">
                    <font color="black">Product Name</font>
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formData.productname.value}
                    name="productname"
                    placeholder="Enter product name"
                    className={`form-control ${
                      formData.productname.error ? 'is-invalid' : ''
                    }`}
                  />
                  {formData.productname.error && (
                    <div className="invalid-feedback">
                      {formData.productname.error}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <font color="black">Quantity</font>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    value={formData.quantity.value}
                    name="quantity"
                    placeholder="Enter Quantity Required"
                    className={`form-control ${
                      formData.quantity.error ? 'is-invalid' : ''
                    }`}
                  />
                  <span className="input-group-text">Kg</span>
                  {formData.quantity.error && (
                    <div className="invalid-feedback">
                      {formData.quantity.error}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <font color="black">Price</font>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    value={formData.price.value}
                    name="price"
                    placeholder="Enter the Price"
                    className={`form-control ${
                      formData.price.error ? 'is-invalid' : ''
                    }`}
                  />
                  <span className="input-group-text">Rs.</span>
                  {formData.price.error && (
                    <div className="invalid-feedback">
                      {formData.price.error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  id="sign-in-button"
                >
                  {loading && (
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Submit Mobile Number
                </button>
              </div>
            </form>
            <form onSubmit={onSubmitOTP}>
              <input
                type="text"
                onChange={handleChange}
                value={otp}
                name="otp"
                placeholder="Enter OTP"
                className="form-control mb-3"
              />
              <button type="submit" className="btn btn-primary">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    web3: state.web3Provider,
    orgContract: state.contractReducer,
  };
};

export default connect(mapStateToProps)(PlaceOrder);
