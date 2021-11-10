'use strict';

const {
  db,
  models: { User, Drink, Order, CartItem },
} = require('../server/db');

const seedDrinks = [
  {
    name: 'Manhattan',
    baseLiquor: 'Bourbon',
    price: 19.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/0DNucpJYn9A',
    stock: 15,
    description: 'blah blah blah',
  },
  {
    name: 'Tequila Sunrise',
    baseLiquor: 'Tequila',
    price: 15.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/8-OxzaRSRaU',
    stock: 10,
    description: 'blah blah blah',
  },
  {
    name: 'Rum and Coke',
    baseLiquor: 'Rum',
    price: 15.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/woLpKjQisW8',
    stock: 15,
    description: 'blah blah blah',
  },
  {
    name: 'Berry Martini',
    baseLiquor: 'Vodka',
    price: 17.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/XoN3v3Ge7EE',
    stock: 20,
    description: 'blah blah blah',
  },
  {
    name: 'Vodka Soda',
    baseLiquor: 'Vodka',
    price: 13.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/5DjIG8epHok',
    stock: 20,
    description: 'blah blah blah',
  },
  {
    name: 'Mojito',
    baseLiquor: 'Rum',
    price: 14.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/yrNg91a3Opk',
    stock: 15,
    description: 'blah blah blah',
  },
  {
    name: 'Spiked Cherry Cola',
    baseLiquor: 'Bourbon',
    price: 18.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/gj7BLlSzIFs',
    stock: 15,
    description: 'blah blah blah',
  },
  {
    name: 'Margarita',
    baseLiquor: 'Tequila',
    price: 18.99,
    alcoholContent: 80,
    image: 'https://unsplash.com/photos/vyrKOU7qZfM',
    stock: 25,
    description: 'blah blah blah',
  },
  // {
  //   name: ,
  //   baseLiquor: ,
  //   price: ,
  //   alcoholContent: 80,
  //   image: ,
  //   stock: ,
  //   description: 'blah blah blah'
  // },
];

const seedUsers = [
  {
    username: 'fettuccine@gmail.com',
    password: 'imhungry',
    firstName: 'Fettuccine',
    lastName: 'Alfredo',
    isAdmin: true,
  },
  {
    username: 'risotto@gmail.com',
    password: 'imhungry',
    firstName: 'Mushroom',
    lastName: 'Risotto',
    isAdmin: false,
  },
  {
    username: 'tortelloni@gmail.com',
    password: 'imhungry',
    firstName: 'Tortelloni',
    lastName: 'Pesto',
    isAdmin: false,
  },
];

const seedOrders = [{ active: true }, { active: true }];

const seedCartItems = [{ quantity: 1 }, { quantity: 2 }, { quantity: 1 }];

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Seeding Users
  await Promise.all(
    seedUsers.map((user) => {
      return User.create(user);
    })
  );

  // Seeding Drinks
  await Promise.all(
    seedDrinks.map((drink) => {
      return Drink.create(drink);
    })
  );

  // seeding orders
  await Promise.all(
    seedOrders.map((order) => {
      return Order.create(order);
    })
  );

  // seeding cartItems
  await Promise.all(
    seedCartItems.map((cartItem) => {
      return CartItem.create(cartItem);
    })
  );

  // setting relations for orders, cartitems, and users
  const user1 = await User.findByPk(1);
  const user2 = await User.findByPk(2);

  const order1 = await Order.findByPk(1);
  const order2 = await Order.findByPk(2);

  await order1.setUser(user1);
  await order2.setUser(user2);

  const cartItem1 = await CartItem.findByPk(1);
  const cartItem2 = await CartItem.findByPk(2);
  const cartItem3 = await CartItem.findByPk(3);

  await order1.setCartItems([cartItem1, cartItem2]);
  await order2.setCartItems([cartItem3]);

  await cartItem1.setDrink(await Drink.findByPk(1));
  await cartItem2.setDrink(await Drink.findByPk(2));
  await cartItem3.setDrink(await Drink.findByPk(4));

  db.close();
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
