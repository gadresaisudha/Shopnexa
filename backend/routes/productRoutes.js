import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { addProduct , updateProductDetails, deleteProduct, getAllProducts, getProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts, filterProducts} from "../controllers/productController.js";
import formidable from "express-formidable";
import checkId  from "../middlewares/checkId.js";

const router = express.Router();
router.route('/').get(getAllProducts).post(authenticate, authorizeAdmin,formidable(),addProduct);
router.route('/allproducts').get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.route('/:id').get(getProductById).put(authenticate, authorizeAdmin, formidable(),updateProductDetails).delete(authenticate, authorizeAdmin,deleteProduct);

router.route('/filtered-products').post(filterProducts);


export default router;