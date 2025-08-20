// Updated Analytics.js
import React, { useEffect, useState } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "./../../services/API";
import moment from "moment";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import ContactButton from "../../components/ContactButton";
import StatusBadge from "../../components/StatusBadge";
import { ProgressBar } from "react-loader-spinner";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);
  const colors = ['#98D8FF','#FF8080','#F8F0E5','#F6FDC3', '#CDFAD5','#CDF0EA', '#F6C6EA', '#DFCCFB'];

  useEffect(() => {
    if (token) {
      // Initialize socket connection only when token is available
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: token
        }
      });
      
      setSocket(newSocket);
      
      // Listen for status updates
      newSocket.on('status-updated', (data) => {
        setInventoryData(prev => prev.map(item => 
          item._id === data.inventoryId ? {...item, status: data.status} : item
        ));
      });
      
      return () => newSocket.close();
    }
  }, [token]);

  const getBloodRecords = async () => {
    try {
      const { data } = await API.get('/inventory/get-recent-inventory');
      if (data?.success) {
        setInventoryData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodGroupData();
  }, []);

  const handleStatusUpdate = async (inventoryId, newStatus) => {
    try {
      const { data } = await API.post('/inventory/update-status', {
        inventoryId,
        status: newStatus
      });
      
      if (data.success) {
        // Update local state
        setInventoryData(prev => 
          prev.map(item => 
            item._id === inventoryId ? {...item, status: newStatus} : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <ProgressBar
            visible={true}
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="d-flex flex-row flex-wrap align-items-center justify-content-center">
        {data.map((record, i) => (
          <div 
            key={i} 
            className="card m-3 p-2" 
            style={{ width: "18rem", borderRadius: '10px', backgroundColor: `${colors[i]}` }}
          >
            <div className="card-body">
              <h1 className="card-title card_title bg-light text-dark text-center mb-3">
                {record.bloodGroup}
              </h1>
              <p className="card-text">
                Total In : <b>{record.totalIn}</b> ml
              </p>
              <p className="card-text">
                Total Out : <b>{record.totalOut}</b> ml
              </p>
            </div>
            <div className="card-footer card_footer text-light bg-dark text-center">
              Total Available : <b>{record.availabeBlood}</b> ml
            </div>
          </div>
        ))}
      </div>
      
      <div className="container mt-3 w-75">
        <h1 className="m-3">Recent Blood Logs</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Blood Group</th>
              <th scope="col">Inventory Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Status</th>
              <th scope="col">Donor Email</th>
              <th scope="col">Time Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData?.map((record) => (
              <tr 
                className={
                  record.inventoryType.toLowerCase() === 'in' ? 'table-success' : 'table-danger'
                } 
                key={record._id}
              >
                <td>{record.bloodGroup}</td>
                <td>{record.inventoryType.toUpperCase()}</td>
                <td>{record.quantity} ml</td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
                <td>{record.email}</td>
                <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                <td>
                  <div className="d-flex gap-2">
                    <ContactButton inventory={record} onUpdate={getBloodRecords} />
                    
                    {/* Status update buttons for inventory owners - Add null check for user */}
                    {user && user._id === record.donar && record.status === 'in-contact' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(record._id, 'collected')}
                        >
                          Mark Collected
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusUpdate(record._id, 'available')}
                        >
                          Re-open
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Analytics;