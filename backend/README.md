# Backend Setup

## MongoDB Configuration

### Option 1: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-home-inventory
   JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-home-inventory?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random
   ```

## Running the Server

```bash
npm install
npm start
# or for development:
npm run dev
```

## Default Users

The server automatically creates these users on first run:
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Sign up (users only)
- `GET /api/auth/me` - Get current user
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

