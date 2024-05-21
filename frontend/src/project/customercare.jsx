import React from "react";
import Heading from './heading';

function Customercare() {
    return (
        <div>
            <Heading />
            <div className="cc">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="cus">
                            <h1 className="text-center font-weight-bold">Welcome to Customer Service</h1>
                            <p className="text-center">How can we help you today?</p>
                            <div>
                                <p className="text-center mb-6">
                                    Dear Customers, please be advised that we will never ask for any financial information or for payment for promotion or contest that you have won.
                                    If you receive any suspicious calls claiming to be, please disregard them and refrain from sharing any sensitive information. We are committed to ensuring a safe and
                                    secure shopping experience for all our customers.
                                </p>
                            </div>
                            <div className="form-box">
                                <div className="mb-3 d-flex flex-column gap-2">
                                    <div className="row">
                                        <label htmlFor="question1" className="col-sm-3 col-form-label">I WANT TO KNOW WHERE MY ORDER IS</label>
                                        <div className="col-sm-3 custom-width">
                                            <input type="text" id="question1" className="form-control form-control-sm" placeholder="Order number"/>
                                        </div>
                                        <div className="col-sm-2">
                                            <button className="btn btn-secondary btn-sm btn-block">Track Now</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label htmlFor="return" className="col-sm-3 col-form-label">I WANT TO RETURN SOMETHING</label>
                                        <div className="col-sm-9">
                                            <button className="btn btn-secondary btn-block">Register Return</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customercare;
