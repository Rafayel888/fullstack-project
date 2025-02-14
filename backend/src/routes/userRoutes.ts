import express from 'express';
import registerValidation from '../middleware/validations/inpvalid';
import userController from '../controllers/userController';

import { authMiddleware } from '../middleware/auth-middleware';
import productController from '../controllers/productController';
import multer from 'multer';

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '_' + file.originalname;
    cb(null, name);
  },
});
const productUpload = multer({ storage: productStorage });

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/avatars');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '_' + file.originalname;
    cb(null, name);
  },
});
const avatarUpload = multer({ storage: avatarStorage });

const router = express.Router();

router.post('/register', registerValidation, userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.post(
  '/add-product',
  authMiddleware,
  productUpload.single('image'),
  productController.create,
);
router.get('/products', productController.getAllFill);
router.get('/products/guest', productController.getAllGuest);
router.get('/products/item/:id', productController.getById);
router.get('/my-products/:userId', authMiddleware, productController.getByUserId);
router.put(
  '/update-product/:id',
  authMiddleware,
  productUpload.single('image'),
  productController.update,
);

router.put('/update-profile', authMiddleware, userController.updateUser);

router.get('/current-user', authMiddleware, userController.getCurrentUser);
router.get('/categories', authMiddleware, productController.getCategories);
router.get('/refresh', userController.refresh);

router.post(
  '/upload-avatar',
  authMiddleware,
  avatarUpload.single('profilePicture'),
  userController.updateAvatar,
);

router.delete('/products/delete/:id', authMiddleware, productController.delete);
export default router;
