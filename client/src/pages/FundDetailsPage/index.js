import React, { useEffect, useState } from "react";
import "./fundDetails.css";
import { Link } from "react-router-dom";
import CarouselComponent from "../../components/CarouselComponent";
import FundTags from "./components/FundTags";
import Story from "./components/Story";
import DonationStats from "./components/DonationStats";
import PaymentSideBar from "./components/PaymentSideBar";
import PaymentAccordion from "./components/PaymentAccordion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "react-fullscreen-loading";

const FundDetailsPage = (props) => {
  console.log(props);
  const fundraiserId = props.match.params.fundraiserId;
  const [fundDetails, setFundDetails] = useState();
  const [loading, setLoading] = useState(true);

  console.log("fundraiserID: " + fundraiserId);

  useEffect(() => {
    // when the component loads up, send a req to the server
    const fetchContent = async () => {
      const { data } = await axios.post("/api/campaign/get-campaign-by-id", {
        fundraiserId: fundraiserId,
      });
      if (data.status === 1) {
        console.log(data);
        console.log(typeof data.result.optionalPhotos);

        const images = [data.result.coverPhoto, ...data.result.optionalPhotos];
        data.result.images = images;
        setFundDetails(data.result);
        setLoading(false);
        console.log("result returned ");
      } else {
        console.log("coudlnt get result");
        console.log(data.message);
        setLoading(false);
      }
    };
    fetchContent();
  }, [fundraiserId]);

  const notify = (message) => {
    toast.info(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (loading) {
    return (
      <Loading loading={loading} background="#00AD7C" loaderColor="#B7FE81" />
    );
  }

  return (
    <section id="fund-details-section">
      <div className="white-container">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* Fund title */}
        <h2>{fundDetails.title}</h2>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              {/* Carousel */}
              <CarouselComponent carouselImages={fundDetails.images} />

              {/* Fund posted time ago  */}
              <h3 className="post-time-text">
                {new Date(fundDetails.createdAt).toUTCString()}
              </h3>

              {/* tags and labels */}
              <FundTags tags={fundDetails} />

              {/* donation stats */}
              <DonationStats fundDetails={fundDetails} />

              {/* payment accordion  */}
              <PaymentAccordion payments={fundDetails.paymentOptions} />

              {/* story  */}
              <Story story={fundDetails.story} />

              {/* contact & share button  */}
              <div className="fund-btn-group">
                {/*    <Link to="/#" className="btn btn-type1">
                  CONTACT
                </Link> */}
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    notify(
                      "Link copied! Share it with your friends and family."
                    );
                    navigator.clipboard.writeText(
                      `http://localhost:3000/fundraisers/view/${fundDetails.title}`
                    );
                  }}
                  className="btn btn-type4"
                >
                  SHARE
                </button>
              </div>
            </div>

            <div className="col-lg-4">
              {/* payment sidebar  */}
              <PaymentSideBar payments={fundDetails.paymentOptions} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundDetailsPage;
