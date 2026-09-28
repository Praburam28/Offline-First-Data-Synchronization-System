Offline-First Data Synchronization System
> A full-stack offline-first application for secure record management, batch synchronization, version-based conflict detection, and synchronization history.
Tech Stack: FastAPI · React · TypeScript · MySQL · SQLAlchemy · Alembic · JWT · Material UI · Docker · Redis
---
Overview
The Offline-First Data Synchronization System is a full-stack application designed to support record management and synchronization when clients may temporarily operate without a reliable network connection.
The system provides:
JWT authentication and protected APIs
User registration and profile management
Create, read, update, and delete operations
Record versioning
Batch synchronization of offline operations
Conflict detection and resolution tracking
Synchronization history
React dashboard and management interface
Swagger/OpenAPI documentation
Docker-based development environment
---
Features
Authentication
User registration
Login with JWT
Current-user API
Profile update
Password change
Protected API endpoints
Record Management
Create records
List and search records
View individual records
Update records
Delete records
Soft-delete support
Version tracking
Offline Synchronization
Offline operations can be submitted in batches through:
```http
POST /sync/batch
```
Each operation can contain:
`sync_id`
`record_id`
`operation`
`client_version`
`payload`
`client_timestamp`
Conflict Detection
The application uses record versions to detect stale client updates.
```text
Client Version: 2
Server Version: 3
        |
        v
Version mismatch
        |
        v
Conflict detected
```
This helps prevent outdated offline changes from silently overwriting newer server data.
Synchronization History
Synchronization results can be reviewed through:
```http
GET /sync/history
```
History includes operation status, conflict status, record ID, sync ID, server version, and error information where available.
---
Architecture
```text
┌──────────────────────────────┐
│       React Frontend         │
│   Vite + TypeScript + MUI    │
└──────────────┬───────────────┘
               │ REST / JSON
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│      JWT Authentication      │
└──────────────┬───────────────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
   Records   Sync      Auth
     API     API       API
       │       │
       └───┬───┘
           ▼
    ┌──────────────┐
    │     MySQL    │
    └──────────────┘
           │
           ▼
        Redis
```
---
Technology Stack
Technology	Purpose
Python	Backend language
FastAPI	REST API
SQLAlchemy	ORM
Alembic	Database migrations
Pydantic	Validation
JWT	Authentication
Passlib / bcrypt	Password hashing
React	Frontend
TypeScript	Type-safe frontend
Vite	Frontend build tool
Material UI	UI components
Axios	HTTP client
React Router	Routing
MySQL 8.0	Database
Redis	Supporting infrastructure
Docker	Containerization
Swagger/OpenAPI	API documentation
Postman	API testing
---
Project Structure
```text
offline-first-data-synchronization-system/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── database/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```
---
Prerequisites
Install:
Python 3.x
Node.js and npm
MySQL 8.0
Docker Desktop
Git
---
Backend Setup
```powershell
cd backend
```
Create the virtual environment:
```powershell
python -m venv .venv
```
Activate it in PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```
Install dependencies:
```powershell
pip install -r requirements.txt
```
Run migrations:
```powershell
alembic upgrade head
```
Start the backend:
```powershell
uvicorn app.main:app --reload
```
Backend:
```text
http://127.0.0.1:8000
```
---
Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend:
```text
http://localhost:5173
```
Build for production:
```powershell
npm run build
```
---
Docker
Start services:
```powershell
docker compose up -d
```
Check services:
```powershell
docker compose ps
```
View logs:
```powershell
docker compose logs
```
Stop services:
```powershell
docker compose down
```
---
Swagger / OpenAPI
Swagger UI:
```text
http://127.0.0.1:8000/docs
```
ReDoc:
```text
http://127.0.0.1:8000/redoc
```
OpenAPI JSON:
```text
http://127.0.0.1:8000/openapi.json
```
Recommended API testing order:
```text
1. Register
2. Login
3. Authorize Swagger
4. Create Record
5. List Records
6. Get Record
7. Update Record
8. Batch Synchronize
9. Test Conflict
10. View Sync History
11. Delete Record
```
---
Authentication Flow
```text
Register
   |
   v
Login
   |
   v
JWT Access Token
   |
   v
Authorization Header
   |
   v
Protected APIs
```
Example:
```http
Authorization: Bearer <access_token>
```
---
Record APIs
Create
```http
POST /records
```
Example:
```json
{
  "title": "My Offline Record",
  "content": "Created from the application."
}
```
List
```http
GET /records?page=1&page_size=20&include_deleted=false
```
Get
```http
GET /records/{record_id}
```
Update
```http
PUT /records/{record_id}
```
Example:
```json
{
  "title": "Updated Record",
  "content": "Updated content",
  "version": 1
}
```
Delete
```http
DELETE /records/{record_id}?version=2
```
---
Synchronization
Batch Sync
```http
POST /sync/batch
```
Example:
```json
{
  "operations": [
    {
      "sync_id": "sync-update-003",
      "record_id": "550e8400-e29b-41d4-a716-446655440000",
      "operation": "update",
      "client_version": 2,
      "payload": {
        "title": "Offline Sync Version 3",
        "content": "Successfully synchronized from the offline client."
      },
      "client_timestamp": "2026-09-27T22:05:00Z"
    }
  ]
}
```
Example successful response:
```json
{
  "results": [
    {
      "sync_id": "sync-update-003",
      "record_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "success",
      "conflict_status": "none",
      "message": "Record updated successfully",
      "server_version": 3,
      "error_details": null
    }
  ],
  "total_operations": 1,
  "successful": 1,
  "failed": 0,
  "conflicts": 0
}
```
Sync History
```http
GET /sync/history?page=1&page_size=100
```
---
Conflict Resolution
The system compares the client version with the current server version.
```text
Server Version = 3
Client Version = 2
        |
        v
Version mismatch
        |
        v
Conflict
```
Synchronization results expose fields such as:
```text
status
conflict_status
server_version
error_details
```
This provides traceability for offline changes and conflicts.
---
Frontend Pages
Page	Purpose
Login	User authentication
Register	Account creation
Dashboard	System overview
Records	Record CRUD operations
Sync History	Synchronization tracking
Conflicts	Conflict review
Profile	User profile management
---
Offline-First Workflow
```text
User changes data
       |
       v
Local operation / queue
       |
       v
Network becomes available
       |
       v
POST /sync/batch
       |
       +------------+
       |            |
       v            v
   Success       Conflict
       |            |
       +------┬-----+
              v
       Sync History
```
---
Postman
A Postman collection can be imported to test:
Authentication
Records
Batch synchronization
Conflict scenarios
Synchronization history
The collection uses variables such as:
```text
base_url
access_token
username
password
record_id
record_version
```
Default backend URL:
```text
http://127.0.0.1:8000
```
---
Security
The application uses:
JWT authentication
Password hashing
Protected endpoints
User ownership
Input validation
Record version checking
Do not commit secrets or local environments.
Recommended `.gitignore` entries:
```text
.env
.venv/
node_modules/
__pycache__/
*.pyc
```
---
Troubleshooting
401 Not Authenticated
Check:
Login was successful
Access token exists
Authorization header is present
Token has not expired
CORS Error
Verify that the backend allows:
```text
http://localhost:5173
```
Frontend White Screen
Run:
```powershell
npm install
npm run dev
```
Then inspect the browser console for React or TypeScript errors.
Backend Not Starting
Activate the environment:
```powershell
.\.venv\Scripts\Activate.ps1
```
Then:
```powershell
uvicorn app.main:app --reload
```
---
Useful Commands
Backend
```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
Frontend
```powershell
npm install
npm run dev
npm run build
```
Docker
```powershell
docker compose up -d
docker compose ps
docker compose logs
docker compose down
```
---
Testing Checklist
```text
[ ] Backend starts
[ ] Swagger opens
[ ] User registration works
[ ] Login works
[ ] JWT authorization works
[ ] Create record works
[ ] List records works
[ ] Get record works
[ ] Update record works
[ ] Delete record works
[ ] Batch synchronization works
[ ] Conflict detection works
[ ] Sync history works
[ ] Frontend login works
[ ] Dashboard works
[ ] Records page works
[ ] Sync History page works
[ ] Conflicts page works
[ ] Profile page works
[ ] Docker services run successfully
```
---
Project Objectives
This project demonstrates practical experience with:
REST API development
Full-stack architecture
JWT authentication
SQLAlchemy ORM
MySQL database design
Alembic migrations
React and TypeScript
Offline-first application design
Synchronization queues
Optimistic concurrency
Conflict detection
API documentation
Docker and Docker Compose
---
Future Enhancements
Potential future improvements include:
Automatic background synchronization
Advanced retry policies
More conflict resolution strategies
Real-time synchronization indicators
Enhanced audit reporting
Automated API test suites
CI/CD integration
Production deployment
Monitoring and observability
---
License
This project is intended for learning, development, portfolio, and demonstration purposes.
Add an appropriate open-source license before distributing the repository publicly.
---
Project Summary
Offline-First Data Synchronization System demonstrates a complete workflow for authenticated record management, offline operation synchronization, version-based conflict detection, and synchronization history using modern full-stack technologies.
```text
FastAPI + Python + SQLAlchemy + MySQL
React + TypeScript + Vite + Material UI
JWT + Docker + Swagger/OpenAPI
```
## 👨‍💻 Author

**Prabu Ram**

Full-Stack Developer | Python | FastAPI | React | TypeScript
