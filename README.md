# Bamazon
Bamazon is an Amazon-like store front that takes in orders from customers and depletes stock from the store's inventory using NodeJS and mySQL!

# Set-Up
1. Install dependencies
```
npm i colors console.table inquirer mysql
```

2. Add the following code to a `/config/keys.js` file:
```
exports.mysql = {
    host: <yourhost>,
    port: <yourport>,
    user: <yourusername>,
    password: <yourpassword>,
    database: bamazon_db
  };
  
```

3. Add username to mysql script in `package.json` file (change out database name if you choose to do so)
```
"mysql": "mysql -u <username> -p bamazon_db"
```

4. In terminal, run the following script, and enter password when prompted:
```
npm run-script mysql
```

5. To run seed schema/data from terminal, copy path to `bamazonSchema.sql` then run below command. Once Schema has been set up, repeat but for `bamazonSeed.sql`
```
source <file path>
```

6. Once set up is complete, run `npm start` and begin! 

***
<strong>Video Demonstration:</strong> https://drive.google.com/file/d/1VR4x-_uIHC8i2AcZZ4-rHiD1vEDr1yTm/view
