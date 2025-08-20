const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrgnaisationController, getOrgnaisationForHospitalController, getInventoryHospitalController, getRecentInventoryController, contactRequestController, updateRequestStatusController, updateInventoryStatusController, getContactRequestsController } = require('../controllers/inventoryController');
const router = express.Router();


//ADD INVERNTORY || POST
router.post('/create-inventory', authMiddleware, createInventoryController);

router.get('/get-inventory', authMiddleware, getInventoryController);
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);


router.get('/get-donars', authMiddleware, getDonarsController);
router.get('/get-hospitals', authMiddleware, getHospitalController);
router.get('/get-organisation', authMiddleware, getOrgnaisationController);
router.get('/get-organisation-for-hospital', authMiddleware, getOrgnaisationForHospitalController);

router.post('/contact-request', authMiddleware, contactRequestController);
router.post('/update-request-status', authMiddleware, updateRequestStatusController);
router.post('/update-status', authMiddleware, updateInventoryStatusController);
router.get('/get-contact-requests', authMiddleware, getContactRequestsController);

module.exports = router;