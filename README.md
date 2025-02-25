BACKEND ENV {

PORT = 4000
ORIGIN=http://localhost:3000
DB_URI = mongodb://localhost:27017/caseKLP
SALT = 10
SECRET_KEY = Nz787QEBBmVK4GOxvm6RAMFe4Tr7kFX7WicBZUX9anOa47sjFZT1zOmQQbGwvSWtesk3zJlZkKtJxXDuTqv83Uhp79LeDKfcW2yZy7rzGByOfywrpxLdsne36sjC9DwC
NODE_ENV = developement

}

FRONTEND ENV {

VITE_BACKEND_URL=http://localhost:4000

}
