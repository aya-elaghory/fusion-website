// import fs from 'fs/promises';
// import { ObjectId } from 'bson';

// // Read your products.json as text and parse
// const text = await fs.readFile('./products_int_id.json', 'utf-8');
// const products = JSON.parse(text);

// const converted = products.map(product => {
//   // Create a new object with _id first, then all other keys except id
//   const { id, ...rest } = product;
//   return {
//     id: new ObjectId().toHexString(),
//     ...rest
//   };
// });

// // Write output
// await fs.writeFile('products.json', JSON.stringify(converted, null, 2));
// console.log('Done! Check products.mongo.json for output.');
