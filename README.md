# JimLubs Investment Chat - Setup Guide

## Prerequisites

1. Install Node.js (v14+ recommended) from https://nodejs.org/
2. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
3. Install a code editor (VS Code recommended)

## Backend Setup

1. Create a new directory for the project:
```bash
mkdir jimlubs-chat
cd jimlubs-chat
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install required dependencies:
```bash
npm install express ws mongoose cors bcryptjs jsonwebtoken dotenv
```

4. Create a `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost/jimlubs_chat
JWT_SECRET=your_jwt_secret_here
```

5. Create a directory structure:
```bash
mkdir src
mkdir src/models
mkdir src/routes
mkdir src/middleware
mkdir public
```

6. Save the backend code (from previous message) to `src/server.js`

7. Start MongoDB (commands vary by OS):
- Windows:
```bash
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```
- macOS/Linux:
```bash
mongod
```

8. Start the backend server:
```bash
node src/server.js
```

## Frontend Setup

1. Create a `public` directory in your project folder:
```bash
mkdir public
```

2. Save the HTML code (from previous message) to `public/index.html`

3. Create and save a basic nginx configuration (if using nginx) to `nginx.conf`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    root /path/to/jimlubs-chat/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Connecting Frontend to Backend

1. Add WebSocket connection code to the frontend. Add this JavaScript before the closing `</body>` tag:

```javascript
// WebSocket Connection
const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

ws.onopen = () => {
    console.log('Connected to server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'message':
            messages.push(data.message);
            renderMessages();
            break;
        case 'typing':
            showTypingIndicator(data.username);
            break;
        case 'users':
            onlineUsers = new Set(data.users);
            updateOnlineUsers();
            break;
    }
};

// Modify the message form handler to use WebSocket
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();
    
    if (content && currentUser) {
        ws.send(JSON.stringify({
            type: 'message',
            username: currentUser,
            content: content
        }));
        messageInput.value = '';
    }
});

// Add typing indicator
document.getElementById('messageInput').addEventListener('input', function() {
    ws.send(JSON.stringify({
        type: 'typing',
        username: currentUser
    }));
});
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the backend server:
```bash
node src/server.js
```

3. If using nginx, start/restart nginx:
```bash
sudo service nginx restart  # Linux
sudo nginx -s reload       # macOS
```

4. Access the application:
- Development: Open `http://localhost:3000` in your browser
- Production: Access your domain (e.g., `http://your_domain.com`)

## Testing the Application

1. Open the application in multiple browser windows
2. Create different users in each window
3. Test features:
   - User registration/login
   - Real-time messaging
   - Typing indicators
   - Online user count
   - Message persistence (refresh the page)

## Security Considerations

1. In production:
   - Use HTTPS
   - Enable CORS properly
   - Use secure WebSocket (wss://)
   - Hash passwords
   - Rate limit API endpoints
   - Set up proper MongoDB authentication

2. Add to your `.env` file:
```
NODE_ENV=production
ALLOWED_ORIGINS=https://your_domain.com
```

## Troubleshooting

Common issues and solutions:

1. MongoDB connection fails:
   - Ensure MongoDB is running
   - Check MongoDB connection string
   - Verify MongoDB port (default 27017)

2. WebSocket connection fails:
   - Check if server is running
   - Verify WebSocket port
   - Check nginx configuration
   - Ensure firewall allows WebSocket connections

3. Messages not appearing:
   - Check browser console for errors
   - Verify WebSocket connection
   - Check MongoDB connection
   - Ensure proper message format

## Production Deployment

1. Set up a production server (e.g., DigitalOcean, AWS)
2. Install Node.js, MongoDB, and nginx
3. Set up SSL certificate (Let's Encrypt recommended)
4. Use PM2 to manage the Node.js process:
```bash
npm install -g pm2
pm2 start src/server.js --name jimlubs-chat
pm2 save
```

5. Configure firewall:
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
```

## Maintenance

Regular maintenance tasks:

1. Update dependencies:
```bash
npm update
```

2. Monitor MongoDB:
```bash
mongosh
use jimlubs_chat
db.stats()
```

3. Check logs:
```bash
pm2 logs jimlubs-chat
```

4. Backup database:
```bash
mongodump --db jimlubs_chat --out /backup/path
```

