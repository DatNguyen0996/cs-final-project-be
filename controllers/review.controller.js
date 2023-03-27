const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Review = require("../models/Review");
const reviewController = {};

const limitDefault = process.env.LIMIT;

//add new review
reviewController.createReview = catchAsync(async (req, res, next) => {
  //Get data from request
  let { productId, username, email, comment, star } = req.body;

  star = parseInt(star);

  let filterConditions = [{ isDelete: false }, { new: true }];
  if (email) {
    filterConditions.push({ email: email });
  }
  if (productId) {
    filterConditions.push({ productId: productId });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  // Validation
  let review = await Review.findOne(filterCriteria);
  if (review) {
    throw new AppError(
      400,
      "Bạn đã có bài đánh giá về sản phẩm nay!",
      "Add review Error"
    );
  }

  //process
  review = await Review.create({ productId, username, email, comment, star });

  //Response
  return sendResponse(
    res,
    200,
    true,
    { review },
    null,
    "Create review success"
  );
});

//Get user  cart
reviewController.getReview = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit } = req.query;
  let { productId } = req.params;
  let { email } = req.body;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  //Process
  let defaultConditions = { isDeleted: false };
  let filterIsCommented;
  if (email) {
    filterIsCommented = {
      $and: [defaultConditions, { email: email }, { productId: productId }],
    };
  }
  const countUserComment = await Review.countDocuments(filterIsCommented);

  let filterOneStar = {
    $and: [defaultConditions, { star: 1 }, { productId: productId }],
  };
  let filterTwoStar = {
    $and: [defaultConditions, { star: 2 }, { productId: productId }],
  };
  let filterThreeStar = {
    $and: [defaultConditions, { star: 3 }, { productId: productId }],
  };
  let filterFourStar = {
    $and: [defaultConditions, { star: 4 }, { productId: productId }],
  };
  let filterFiveStar = {
    $and: [defaultConditions, { star: 5 }, { productId: productId }],
  };

  const countOneStar = await Review.countDocuments(filterOneStar);
  const countTwoStar = await Review.countDocuments(filterTwoStar);
  const countThreeStar = await Review.countDocuments(filterThreeStar);
  const countFourStar = await Review.countDocuments(filterFourStar);
  const countFiveStar = await Review.countDocuments(filterFiveStar);

  const countTotalReview = await Review.countDocuments({
    $and: [defaultConditions, { productId: productId }],
  });

  const totalPage = Math.ceil(countTotalReview / limit);
  const offset = limit * (page - 1);

  const reviews = await Review.find({
    $and: [defaultConditions, { productId: productId }],
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    {
      reviews,
      totalPage,
      countTotalReview,
      countOneStar,
      countTwoStar,
      countThreeStar,
      countFourStar,
      countFiveStar,
      countUserComment,
    },
    null,
    "Get review success"
  );
});

//Update a product

// cartController.updateCart = catchAsync(async (req, res, next) => {
//   //Get data from request
//   const updateInfor = req.body;
//   const targetId = req.params.id;
//   const options = { new: true };
//   //Validation

//   let fieldAllow = ["quantity"];

//   if (Object.keys(updateInfor).length !== 0) {
//     fieldAllow = fieldAllow.filter((field) =>
//       Object.keys(updateInfor).includes(field)
//     );
//     if (fieldAllow.length === 0)
//       throw new AppError(400, "Not Allow to Update", "Update product error");
//   } else {
//     throw new AppError(400, "No update information", "Update product error");
//   }
//   const cart = await Cart.findByIdAndUpdate(targetId, updateInfor, options);

//   //Response
//   return sendResponse(
//     res,
//     200,
//     true,
//     { cart },
//     null,
//     "Update a product success"
//   );
// });

// //Delete a product
// cartController.deleteCart = catchAsync(async (req, res, next) => {
//   //Get data from request
//   const targetId = req.params.id;
//   const options = { new: true };
//   const deleteInfor = { isDeleted: true };

//   //process
//   const cart = await Cart.findByIdAndUpdate(targetId, deleteInfor, options);

//   //Response
//   return sendResponse(res, 200, true, { cart }, null, "Delete product success");
// });

module.exports = reviewController;
