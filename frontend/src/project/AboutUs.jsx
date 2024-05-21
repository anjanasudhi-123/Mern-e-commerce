import React from "react";
import Heading from './heading';


function AboutUs() {
    return (
        <div>
            <Heading />
            <div className="about-us-container">
                <div className="about-us-content">
                    <img src="https://i.pinimg.com/originals/08/06/3c/08063c2bb392aa9cc1931e28cefb6408.jpg" alt="About Us" />
                    <h5 className="text-uppercase luxehaven-heading">LuxeHaven</h5>
                    <p>
                        Welcome to LuxeHaven, your ultimate destination for luxury shopping. We offer a curated collection of high-end products from top brands, ensuring quality and exclusivity.
                        Our mission is to provide you with a seamless shopping experience and exceptional customer service. Explore our diverse range of products and indulge in the finest selection
                        of luxury items.
                    </p>
                </div>
                <div className="top-categories-container">
                    <h5 className="top-categories-heading">Our Top Categories:</h5>
                    <div className="images-container">
                        <img src="https://tse2.mm.bing.net/th?id=OIP.Ku7LPjNX7_dEekQVh9gDXgHaE7&pid=Api&P=0&h=180" alt="Category" />
                        <img src="https://tse3.mm.bing.net/th?id=OIP.-0itkD10t-53fY5LsZcVBgAAAA&pid=Api&P=0&h=180" alt="Category" />
                        <img src="https://tse4.mm.bing.net/th?id=OIP.K4Rf2Wl4TOChxSkWoULsdQHaHa&pid=Api&P=0&h=180" alt="Category" />
                        <img src="https://tse1.mm.bing.net/th?id=OIP.iuLiAEq2XQsvHNQZAtfD7AHaHa&pid=Api&P=0&h=180" alt="Category" />
                        <img src="https://tse3.mm.bing.net/th?id=OIP.Y8KrVTslFQGJIkQew1c-FAHaHa&pid=Api&P=0&h=180" alt="Category" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
