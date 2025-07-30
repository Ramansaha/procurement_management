const Router = require('express');
const router = Router();
const auth = require('../../controllers/auth/auth');
const order = require('../../controllers/order/order');
const { celebrate } = require('celebrate');
const { validation } = require('../../helper/validation');

// Create order – Only Procurement Manager
router.post('/create',
    celebrate(validation.createOrder),
    auth.isAuth,
    order.checkRole(['procurement_manager']),
    order.createOrder
);

// View orders – Admin, Procurement Manager, Inspection Manager, Client
router.post('/list',
    auth.isAuth,
    order.getOrders
);

// Update status – Admin, Procurement Manager, Inspection Manager
router.patch('/update-status',
    celebrate(validation.updateOrderStatus),
    auth.isAuth,
    order.checkRole(['admin', 'procurement_manager', 'inspection_manager']),
    order.updateOrderStatus
);

// Link checklist – Only Procurement Manager
router.patch('/link-checklist',
    celebrate(validation.linkChecklist),
    auth.isAuth,
    order.checkRole(['procurement_manager']),
    order.linkChecklist
);

module.exports = router;
