
import { productSchema } from '../../../security/productDataValidation.js'


class AdminProductController {

   #adminProductUseCase

   constructor(adminProductUseCase) {
      this.#adminProductUseCase = adminProductUseCase
   }

   async addNewProduct(req, res, next) {
      try {
         const body = {
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock)
         };
         
         const { error } = productSchema.validate(body, { abortEarly: false });

        
         
         if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ message: errorMessages });
         }
         
         if (!req.files || req.files.length < 1) {
            return res.status(400).json({ message: 'You should add at least one product image' });
         }
         
         const response = await this.#adminProductUseCase.addNewProduct(body, req.files);

         if (response.status == 200) {
            return res.status(200).json({ message: response.message, productData: response.data });
         }
         return res.status(response.status).json({ message: response.message });
      } catch (error) {
         next(error)
      }
   }
   async allProducts(req, res, next) {
      try {

         const response = await this.#adminProductUseCase.takeAllProduct(req.query);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, productData: response.data, pagination: response.pagination });
         }
         return res.status(response.status).json({ message: response.message });

      } catch (error) {
         next(error)
      }
   }
   async updateListing(req, res, next) {
      try {
         const response = await this.#adminProductUseCase.updateListing(req.query);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, productData: response.data });
         }
         return res.status(response.status).json({ message: response.message });

      } catch (error) {
         next(error)
      }
   }
   async deleteProduct(req, res, next) {
      try {
         const response = await this.#adminProductUseCase.deleteProduct(req.params.id);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message });
         }
         return res.status(response.status).json({ message: response.message });

      } catch (error) {
         next(error)
      }
   }
   async updateProductData(req, res, next) {
      try {
         const body = {};
         for (let item in req.body) {
            if (item !== 'productId') {
               // Convert price and stock to numbers
               if (item === 'price' || item === 'stock') {
                  body[item] = Number(req.body[item]);
               } else {
                  body[item] = req.body[item];
               }
            }
         }
         const { error } = productSchema.validate(body, { abortEarly: false });
         if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ message: errorMessages });
         }

         const response = await this.#adminProductUseCase.updateProductData(req.body);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, data: response.data, updated: response.updated });
         }
         return res.status(response.status).json({ message: response.message });
      } catch (error) {
         next(error)
      }
   }
   async updateProductImage(req, res, next) {
      try {

         const response = await this.#adminProductUseCase.updateProductImage(req.body, req.files);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, data: response.data, updated: response.updated });
         }
         return res.status(response.status).json({ message: response.message });
      } catch (error) {
         next(error)
      }
   }
   async takeProductCategory(req, res, next) {
      try {
         const response = await this.#adminProductUseCase.takeProductCategory()
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, categoryData: response.data })
         }
         return res.status(response.status).json({ message: response.message })
      } catch (error) {
         next(error)
      }
   }
   async searchProduct(req, res, next) {
      try {
         const value = req.params.value
         const response = await this.#adminProductUseCase.searchProduct(value);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, productData: response.data });
         }
         return res.status(response.status).json({ message: response.message });



      } catch (error) {
         next(error)
      }
   }
   async updateDetails(req, res, next) {
      try {

         const response = await this.#adminProductUseCase.updateProductDetails(req.body);
         if (response.status == 200) {
            return res.status(200).json({ message: response.message, productData: response.data });
         }
         return res.status(response.status).json({ message: response.message });

      } catch (error) {
         next(error)
      }
   }
}
export default AdminProductController;