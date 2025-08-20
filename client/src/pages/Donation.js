import moment from "moment";
import React, { useEffect, useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import API from "../services/API";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-loader-spinner";
import ContactButton from "../components/ContactButton";
import StatusBadge from "../components/StatusBadge";

const Donation = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Find available blood donations (not user's own donations)
  const getAvailableBlood = async () => {
    try {
      setLoading(true);
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "in",
        },
      });
      if (data?.success) {
        // Filter out user's own donations
        const availableBlood = data?.inventory?.filter(
          item => item.donar !== user?._id
        );
        setData(availableBlood);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    getAvailableBlood();
  };

  useEffect(() => {
    getAvailableBlood();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <ProgressBar
            visible={true}
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div className="container mt-4">
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                  <h2 className="mb-0">Available Blood Donations</h2>
                  <p className="mb-0 mt-2">Contact donors to request blood donations</p>
                </div>
                <div className="card-body">
                  {data.length === 0 ? (
                    <div className="alert alert-info text-center">
                      <h4>No blood donations available at the moment</h4>
                      <p>Please check back later or contact local blood banks.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">Blood Group</th>
                            <th scope="col">Donor Info</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Organisation</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.map((record) => (
                            <tr key={record._id}>
                              <td>
                                <span className="badge badge-danger badge-lg">
                                  {record.bloodGroup}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <strong>{record.email}</strong>
                                  {record.donar?.name && (
                                    <div className="small text-muted">
                                      {record.donar.name}
                                    </div>
                                  )}
                                  {record.donar?.phone && (
                                    <div className="small text-muted">
                                      📞 {record.donar.phone}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-light">
                                  {record.quantity} ml
                                </span>
                              </td>
                              <td>
                                <div>
                                  {record.organisation?.organisationName || 
                                   record.organisation?.name || 
                                   record.organisation?.email}
                                  {record.organisation?.address && (
                                    <div className="small text-muted">
                                      📍 {record.organisation.address}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>
                                    {moment(record.createdAt).format("DD/MM/YYYY")}
                                  </strong>
                                  <div className="small text-muted">
                                    {moment(record.createdAt).format("hh:mm A")}
                                  </div>
                                  <div className="small text-info">
                                    {moment(record.createdAt).fromNow()}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <StatusBadge status={record.status} />
                              </td>
                              <td>
                                <ContactButton 
                                  inventory={record} 
                                  onUpdate={handleUpdate}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Donation;