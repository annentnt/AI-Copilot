import { MongoClient } from 'mongodb';


const uri ='mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'chatbot-platform'; // Database name

let db;

const client = new MongoClient(uri);


async function connectDB() {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Kết nối MongoDB thành công');
    return db;
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    throw err;
  }
}


const queryDatabase = async (collectionName, query) => {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result;
    } catch (err) {
        console.error('Error querying database:', err);
        throw err;
    }
};

// Test the queryDatabase function
queryDatabase('yourCollectionName', { yourField: 'yourValue' })
    .then(result => console.log('Query result:', result))
    .catch(err => console.error('Error during query test:', err));


const insertIntoDatabase = async (collectionName, document) => {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    return result;
  } catch (err) {
    console.error('Error inserting into database:', err);
    throw err;
  }
};

// Test the insertIntoDatabase function
insertIntoDatabase('users', { username: 'danno2004', password: '12012004' }) // Thay thế yourCollectionName và yourField với giá trị thực tế
    .then(result => console.log('Insert result:', result))
    .catch(err => console.error('Error during insert test:', err));

insertIntoDatabase('users', { username1: 'urikvy2006', password1: '14052006' }) // Thay thế yourCollectionName và yourField với giá trị thực tế
    .then(result => console.log('Insert result:', result))
    .catch(err => console.error('Error during insert test:', err));
// Export các hàm


const getDataFromDatabase = async (collectionName, query) => {
    try {
        const result = await queryDatabase(collectionName, query);
        return result;
    } catch (err) {
        console.error('Error getting data from database:', err);
        throw err;
    }
};

// Test the getDataFromDatabase function
getDataFromDatabase('users', { username: 'danno2004', password: '12012004' },{ username1: 'urikvy2006', password1: '14052006' }) // Thay thế yourCollectionName và yourField với giá trị thực tế
    .then(result => console.log('Get data result:', result))
    .catch(err => console.error('Error during get data test:', err));

export { connectDB, queryDatabase, insertIntoDatabase };