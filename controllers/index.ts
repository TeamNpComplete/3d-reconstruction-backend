import express, { Router } from 'express';

let router:Router = express.Router();

router.use('/generate', require('./reconstruction'));

module.exports = router;