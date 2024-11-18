import Products from "../model/productModel.js";
export const getProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const addProduct = async (req, res) => {
  const { title, price, description, category } = req.body;
  const imgPath = req.files.map((file) => file.path);
  try {
    // Validate that all required fields are present
    if (!title || !price || !description || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newProduct = new Products({
      title,
      price,
      description,
      category,
      images: imgPath,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ msg: "Product added successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, images, rating } = req.body;
  try {
    const data = {};
    if (name) data.name = name;
    if (price) data.price = price;
    if (description) data.description = description;
    if (category) data.category = category;
    if (images) data.images = images;

    // Find the product to update
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "No product found" });
    }

    // Update or add rating
    if (rating && rating.userId && rating.rating !== undefined) {
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userId.toString() === rating.userId.toString()
      );

      if (existingRatingIndex !== -1) {
        // to update the exisiting rating
        product.ratings[existingRatingIndex].rating = rating.rating;
        product.ratings[existingRatingIndex].review =
          rating.review || product.ratings[existingRatingIndex].review;
      } else {
        // to add a new rating
        product.ratings.push({
          userId: rating.userId,
          rating: rating.rating,
          review: rating.review,
        });
      }
    }

    // assigning other fields to the product
    Object.assign(product, data);

    // Saving the updated product
    const updatedProd = await product.save();
    return res.status(200).json({
      msg: "Updated successfully",
      product: updatedProd,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProd = await Products.findByIdAndDelete(id);
    if (!deletedProd) {
      return res.status(400).json({ msg: "no product found" });
    }
    return res
      .status(200)
      .json({ msg: "deleted success", deleted_product: deletedProd });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
