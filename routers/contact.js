import { Router } from 'express';
import ContactController from '../controllers/contact.js';
const routerContact = Router();

routerContact.post('/', ContactController.contact);

export default routerContact;
