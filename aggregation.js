db.products.aggregate([
    // Match products with price under 1000
    {
      $match: {
        price: { $lt: 1000 }
      }
    },
    // Lookup to join with pizzas collection
    {
      $lookup: {
        from: "pizzas", // Name of the pizzas collection
        localField: "_id", // Field in the products collection to match
        foreignField: "_id", // Field in the pizzas collection to match
        as: "relatedPizzas" // Name for the joined data array
      }
    },
    // Optionally, add fields to structure the output
    {
      $addFields: {
        totalItems: { $size: "$relatedPizzas" } // Count of related pizzas
      }
    },
    // Project (select) only the fields you want in the output
    {
      $project: {
        title: 1,
        price: 1,
        relatedPizzas: 1,
        totalItems: 1
      }
    }
  ]);
  