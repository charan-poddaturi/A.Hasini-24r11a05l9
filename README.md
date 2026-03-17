# SafeHub

SafeHub is an emergency response platform that enables individuals to trigger SOS alerts, share live location, manage emergency contacts, locate nearby hospitals/police, and access safety protocols — all with multilingual support.

## Features
- JWT-based authentication with user profiles
- SOS alert with real-time location and notifications
- Emergency contacts management
- Nearby hospitals/police/fire stations via OpenStreetMap
- Blood donor registry + request workflow
- Emergency protocols (CPR, fire safety etc.)
- Multilingual (English + Hindi)
- Responsive mobile-first UI (React + Tailwind)
- Real-time events with Socket.io
- Dockerized backend/frontend + MongoDB

## Quick Start (Local)

### Prerequisites
- Node.js 18+ / npm
- Docker (optional, for docker-compose)
- MongoDB (local or Docker)

### Option 1: Run with Docker Compose (Recommended)

```bash
# Start all services (MongoDB, backend, frontend)
docker-compose up --build

# Seed the database (in another terminal)
docker-compose exec backend npm run seed

# Open http://localhost:5173
```

### Option 2: Run Locally

#### Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Or install MongoDB locally and start it
```

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your settings (JWT secret, Twilio creds, etc.)
npm install
npm run seed  # Seed database
npm run dev   # Runs on http://localhost:4000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev   # Runs on http://localhost:5173
```

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/safehub
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
PORT=4000
GOOGLE_MAPS_API_KEY=your_google_maps_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=your_twilio_number
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.development)
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/emergency-contacts` - Add emergency contact
- `PUT /api/users/emergency-contacts/:id` - Update contact
- `DELETE /api/users/emergency-contacts/:id` - Delete contact

### SOS
- `POST /api/sos/trigger` - Trigger SOS alert
- `GET /api/sos/history` - Get user's SOS history
- `GET /api/sos/all` - Get all alerts (admin)

### Location
- `GET /api/nearby/hospitals?lat=&lng=&radius=` - Nearby hospitals
- `GET /api/nearby/police?lat=&lng=&radius=` - Nearby police
- `GET /api/nearby/fire?lat=&lng=&radius=` - Nearby fire stations

### Donors
- `GET /api/donors/search?bloodType=&city=` - Search donors
- `POST /api/donors/register` - Register as donor
- `PUT /api/donors/availability` - Update availability
- `POST /api/donors/request` - Request blood
- `PUT /api/donors/verify/:id` - Verify donor (admin)

### Protocols
- `GET /api/protocols?lang=en` - Get emergency protocols

### Public Numbers
- `GET /api/public-numbers/:country` - Get public emergency numbers

## Project Structure

```
safehub/
├── backend/                 # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, rate limiting
│   │   ├── utils/           # Helpers
│   │   └── scripts/         # Database seeding
│   ├── __tests__/           # Unit tests
│   └── package.json
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API clients
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── i18n/            # Internationalization
│   └── package.json
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## Development

### Backend
```bash
cd backend
npm run dev      # Development with hot reload
npm run build    # Build for production
npm run start    # Run production build
npm run test     # Run tests
npm run lint     # Lint code
```

### Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Manual Testing
1. Register a new user
2. Add emergency contacts
3. Trigger SOS (check console for notifications)
4. Search for nearby places
5. Register as donor and search donors
6. Switch language in settings

## Deployment

### Docker
```bash
docker-compose up -d --build
```

### Cloud Deployment
- Backend: Deploy to Heroku, Railway, or AWS ECS
- Frontend: Deploy to Vercel, Netlify, or AWS S3+CloudFront
- Database: MongoDB Atlas or AWS DocumentDB

## Security Notes
- JWT tokens expire in 7 days
- SOS endpoint rate limited to 5 requests per minute
- Passwords hashed with bcrypt
- CORS configured for frontend origin
- Input validation on all endpoints

## Future Enhancements
- Add offline service worker caching with Workbox
- Implement real push notifications (FCM)
- Add admin dashboard for donor verification
- Integrate with emergency services APIs
- Add voice commands with Web Speech API
- Implement discreet alert modes
- Add battery optimization features

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License
MIT License - see LICENSE file for details.
