const path = require('path');
// const productModel = require('../models/productModels');
const songModel = require('../models/songModel');
const fs = require('fs');
// const User = require('../models/userModels');
const User = require('../models/userModel');

const Products = require('../models/productModels.js');


const createSong = async (req, res) => {
    console.log(req.body)
    console.log(req.files)
    const { songName, songLyrics } = req.body;

    if (!songName || !songLyrics ) {
        return res.status(400).json({
            success: false,
            message: "All the fields required"
        })

    }

    //check product image
    // if (!req.files || !req.files.productImage) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Image not found!"
    //     })
    // }

    // const { productImage } = req.files;

    //uploading
    //1. generate unique name for each file
    // const imageName = `${Date.now()}-${productImage.name}`;
    //2. define specific path
    // const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

    //3. upload to that path(await | trycatch)
    // try {
    //     await productImage.mv(imageUploadPath)

    //     //save to database
    //     const newProduct = new productModel({
    //         songName: songName,
    //         productPrice: productPrice,
    //         productDescription: productDescription,
    //         productCategory: productCategory,
    //         productImage: imageName
    //     })
    //     const product = await newProduct.save();
    //     res.status(201).json({
    //         success: true,
    //         message: "Product created",
    //         data: product
    //     })

    // } catch (error) {
    //     console.log(error)
    //     res.json({
    //         success: false,
    //         message: "Internal server error",
    //         error: error
    //     })
    // }
}

// fetch all products
const getAllSongs= async (req, res) => {
    //#. try catch
    try {
        // 1. find all the products(Await)
        const songs = await songModel.find({})
        // 2. send response
        res.status(200).json({
            success: true,
            message: 'song fetched successfully',
            songs: songs
        })

    } catch (error) {
        console.log(e);
    }
};


//pagination
// const pagination = async (req, res) => {
//     const resultPerPage = 9;
//     const pageNo = parseInt(req.query.page) || 1;
//     const searchTerm = req.query.search || '';

//     try {
//         const query = searchTerm
//             ? {
//                 $or: [
//                     { songName: { $regex: searchTerm, $options: 'i' } },
//                     { productDescription: { $regex: searchTerm, $options: 'i' } },
//                     { productCategory: { $regex: searchTerm, $options: 'i' } }
//                 ]
//             }
//             : {};

//         const totalProducts = await productModel.countDocuments(query);
//         const totalPages = Math.ceil(totalProducts / resultPerPage);

//         const products = await productModel.find(query)
//             .skip((pageNo - 1) * resultPerPage)
//             .limit(resultPerPage);

//         if (products.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No products found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Products fetched",
//             products: products,
//             currentPage: pageNo,
//             totalPages: totalPages,
//             totalProducts: totalProducts
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server error"
//         });
//     }
// };

// fetch single product
const getSongs = async (req, res) => {

    //rceive id from URL
    const songId = req.params.id;

    try {
        const song = await productModel.findById(songId)
        res.status(201).json({
            success: true,
            message: "song Fetched!",
            song: song
        })


    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error!"
        })

    }

}

// Add a song to the site let it be cart for adding the song
const addToCart = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { songId } = req.body;
        if (!songId) {
            return res.status(400).json({ success: false, message: 'song ID is required' });
        }

        // Check if the product is already in the cart
        if (!user.cartItem.some(item => item.equals(songId))) {
            user.cartItem.push(songId);
            await user.save();
            return res.status(200).json({ success: true, message: 'song added to cart' });
        } else {
            return res.status(400).json({ success: false, message: 'song already in cart' });
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Remove a product from the cart
// i am thinking the the song can only be removed by admin or herum k garne
const removeCartItem = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { songId } = req.params;

        if (!user) {
            return res.status(404).json({ success: false, message: 'song not found' });
        }

        if (!Array.isArray(user.cartItem)) {
            user.cartItem = [];
        }

        // Log current cart items
        console.log('Current cart items:', user.cartItem);

        // Remove the product from the cart
        const initialCartLength = user.cartItem.length;
        user.cartItem = user.cartItem.filter(item => item.toString() !== songId);

        // Check if any items were removed
        if (user.cartItem.length === initialCartLength) {
            return res.status(404).json({ success: false, message: 'song not found in cart' });
        }

        // Log updated cart items
        console.log('Updated cart items:', user.cartItem);

        await user.save();

        res.status(200).json({ success: true, message: 'song removed from cart' });
    } catch (error) {
        console.error('Error in removeCartItem:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Get all products in the cart
const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch the user and populate the 'cart' field with product details
        const user = await User.findById(userId).populate({
            path: 'cartItem', // Use 'cartItems' as defined in your schema
            select: '-__v', // Adjust fields as necessary
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("Cart Items:", user.cartItem); // Log the cart items
        const finalCartItems = user.cartItem.map(item => {
            // Convert Mongoose document to a plain JavaScript object
            const plainItem = item.toObject();
            // Now you can add new properties
            plainItem.quantity = 1;
            return plainItem;
        });
        
        return res.status(200).json({ success: true, cartItem: finalCartItems });
    } catch (error) {
        console.error("Error in getCartItems:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


// delete song
const deleteSong = async (req, res) => {
    // get product id
    const songId = req.params.id;

    try {
        const existingSong = await songModel.findById(req.params.id)
        const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

        // delete from file system
        fs.unlinkSync(oldImagePath)
        await songModel.findByIdAndDelete(songId)

        //fetch products

        res.status(201).json({
            success: true,
            message: "song deleted"
            // updated productlist

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }
}

// update product
// 1. get a  update id
// 2. if new image is provided
// 3. Upload(public)
// 4. Delete old image- yeslai delete product ma ne implement garney
// 5. update products

const updateProduct = async (req, res) => {
    try {

        // if there is files, upload new and delete old
        if (req.files && req.files.productImage) {

            // upload new to /public/products
            // 1. destructire file
            const { productImage } = req.files;

            //make a new image name
            const imageName = `${Date.now()}-${productImage.name}`;

            //2. define specific path
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

            // move to folder
            await productImage.mv(imageUploadPath)

            // replace productImage name to new name
            req.body.productImage = imageName

            // # delete old image
            // #.1 find product imformation(we have only ID)
        }
        const existingProduct = await productModel.findById(req.params.id)
        // search that inage in directory
        if (req.body.productImage) {// if new image is uploaded, then only remove old image
            const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

            // delete from file system
            fs.unlinkSync(oldImagePath)

        }

        // update in database
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            success: true,
            message: "Product Updated Successfully",
            updatedProduct: updatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Internal server error",
            error: error
        })

    }

}

// (productsearch the products
const searchSongs = async (req, res) => {
    const { search, page, limit, sort } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10; // Default page size
    const sortBy = sort || "createdAt"; // Default sort field (use your preferred default)

    try {
        let query = {};

        // Construct the search query
        if (search) {
            query.songName = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Sorting
        const sortOptions = {};
        if (sortBy) {
            const [field, order] = sortBy.split(","); // e.g., "createdAt,desc"
            sortOptions[field] = order || "asc"; // Default to ascending order if not specified
        }

        // Fetch products with pagination and sorting
        const products = await Products.find(query)
            .sort(sortOptions)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        // Count total documents matching the query
        const totalProducts = await Products.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Products searched successfully",
            products,
            totalPages: Math.ceil(totalProducts / pageSize),
        });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};

module.exports = {
    createSong,
    getAllSongs,
    getSongs,
    deleteSong,
    updateProduct,
    pagination,
    addToCart,
    getCartItems,
    removeCartItem,
    searchSongs,
}