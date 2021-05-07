import express, { Router } from 'express';

let router:Router = express.Router();

router.use('/reconstruction', require('./reconstruction'));

module.exports = router;