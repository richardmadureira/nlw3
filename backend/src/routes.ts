import express from 'express';
import multer from 'multer';
import OrphanagesController from './controllers/OrphanagesController';
import uploadConfig from './config/upload';

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/orphanages', upload.array('images'), OrphanagesController.create);
routes.get('/orphanages', OrphanagesController.findAll);
routes.delete('/orphanages/:id', OrphanagesController.delete);
routes.get('/orphanages/:id', OrphanagesController.findById);

export default routes;