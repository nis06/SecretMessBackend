const express = require('express');
const router = express.Router();
const {secretMess,getAllMessage}=require('../controllers/Secret')

router.post('/mess',secretMess)
router.get('/allMess',getAllMessage)

module.exports=router;