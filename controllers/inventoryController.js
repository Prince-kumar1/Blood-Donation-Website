const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    console.log(email);
    console.log(user);
    if (!user) {
      console.log("USER NOT FOUND");
      throw new Error("ERROR USER NOT FOUND");
    }

    // if(inventoryType ==='in' && user.role !== 'donar'){
    //     throw new Error("NOT A DONAR ACCOUNT");
    // }
    // if(inventoryType === 'out' && user.role !== 'hospital'){
    //     throw new Error('Not a hospital account');
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ml of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    const inventory = new inventoryModel(req.body);
    await inventory.save();

    res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (err) {
    console.log("Error in creating inventory: ", err);
    return res.status(500).send({
      success: false,
      message: "Error in creating inventory",
      err,
    });
  }
};

const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all record successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all inventory",
      error,
    });
  }
};

const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital comsumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};


// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};


const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donars
    const donorId = await inventoryModel.distinct("donar", {
      organisation,
    });
    // console.log(donorId);
    const donars = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donar Record Fetched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //GET hospital ID
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getHospital Api",
      error,
    });
  }
};

const getOrgnaisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donar });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};

const getOrgnaisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital ORG API",
      error,
    });
  }
};

// Contact request controller
const contactRequestController = async (req, res) => {
  try {
    const { inventoryId, message } = req.body;
    const requester = req.body.userId;
    
    const inventory = await inventoryModel.findById(inventoryId);
    if (!inventory) {
      return res.status(404).send({
        success: false,
        message: "Inventory not found"
      });
    }
    
    // Check if already has a pending request
    const existingRequest = inventory.contactRequests.find(
      request => request.requester.toString() === requester && 
                request.status === "pending"
    );
    
    if (existingRequest) {
      return res.status(400).send({
        success: false,
        message: "You already have a pending request for this blood"
      });
    }
    
    inventory.contactRequests.push({
      requester,
      message
    });
    
    await inventory.save();
    
    // Get IO instance and emit event
    const io = req.app.get('socketio');
    io.to(inventory.donar.toString()).emit('new-contact-request', {
      from: req.user,
      inventoryId: inventory._id,
      message
    });
    
    return res.status(200).send({
      success: true,
      message: "Contact request sent successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in contact request",
      error
    });
  }
};

// Update request status controller
const updateRequestStatusController = async (req, res) => {
  try {
    const { inventoryId, requestId, status } = req.body;
    const userId = req.body.userId;
    
    const inventory = await inventoryModel.findById(inventoryId);
    if (!inventory) {
      return res.status(404).send({
        success: false,
        message: "Inventory not found"
      });
    }
    
    // Check if user owns the inventory
    if (inventory.donar.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: "Not authorized to update this request"
      });
    }
    
    const request = inventory.contactRequests.id(requestId);
    if (!request) {
      return res.status(404).send({
        success: false,
        message: "Request not found"
      });
    }
    
    request.status = status;
    
    // If accepted, update inventory status
    if (status === "accepted") {
      inventory.status = "in-contact";
      
      // Reject all other pending requests
      inventory.contactRequests.forEach(req => {
        if (req.status === "pending" && req._id.toString() !== requestId) {
          req.status = "rejected";
        }
      });
    }
    
    await inventory.save();
    
    // Notify the requester
    const io = req.app.get('socketio');
    io.to(request.requester.toString()).emit('request-status-updated', {
      inventoryId: inventory._id,
      requestId,
      status
    });
    
    return res.status(200).send({
      success: true,
      message: `Request ${status} successfully`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating request status",
      error
    });
  }
};

// Update inventory status controller
const updateInventoryStatusController = async (req, res) => {
  try {
    const { inventoryId, status } = req.body;
    const userId = req.body.userId;
    
    const inventory = await inventoryModel.findById(inventoryId);
    if (!inventory) {
      return res.status(404).send({
        success: false,
        message: "Inventory not found"
      });
    }
    
    // Check if user owns the inventory or is an admin
    if (inventory.donar.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Not authorized to update this inventory"
      });
    }
    
    inventory.status = status;
    await inventory.save();
    
    // Notify all users who had contact requests
    const io = req.app.get('socketio');
    inventory.contactRequests.forEach(request => {
      io.to(request.requester.toString()).emit('inventory-status-updated', {
        inventoryId: inventory._id,
        status
      });
    });
    
    return res.status(200).send({
      success: true,
      message: `Inventory status updated to ${status}`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating inventory status",
      error
    });
  }
};

// Get contact requests for user
const getContactRequestsController = async (req, res) => {
  try {
    const userId = req.body.userId;
    
    // Get inventories where user is donor and has contact requests
    const inventories = await inventoryModel.find({
      donar: userId,
      'contactRequests.0': { $exists: true }
    }).populate('contactRequests.requester', 'name email phone');
    
    const requests = [];
    inventories.forEach(inventory => {
      inventory.contactRequests.forEach(request => {
        requests.push({
          _id: request._id,
          inventoryId: inventory._id,
          bloodGroup: inventory.bloodGroup,
          quantity: inventory.quantity,
          requester: request.requester,
          message: request.message,
          status: request.status,
          createdAt: request.timestamp
        });
      });
    });
    
    // Sort by date, newest first
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.status(200).send({
      success: true,
      message: "Contact requests fetched successfully",
      requests
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching contact requests",
      error
    });
  }
};
module.exports = {
  createInventoryController,
  getInventoryController,
  getHospitalController,
  getDonarsController,
  getOrgnaisationController,
  getOrgnaisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
    contactRequestController,
  updateRequestStatusController,
  updateInventoryStatusController,
  getContactRequestsController
};
