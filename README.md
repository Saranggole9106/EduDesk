# EduDesk - Student Helpdesk System

A modern student helpdesk system with role-based access control and real-time updates.

## Features

- Multi-role system (Student, Staff, Admin)
- Real-time ticket updates
- File attachments
- Role-based permissions
- Modern UI/UX
- Responsive design

## Live Demo

Visit [https://[your-username].github.io/student-helpdesk](https://[your-username].github.io/student-helpdesk)

## Test Credentials

- Student: `student@edudesk.com` / `student123`
- Staff: `staff@edudesk.com` / `staff123`
- Admin: `admin@edudesk.com` / `admin123`

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/student-helpdesk.git
   cd student-helpdesk
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # OR using Node.js
   npx serve .
   ```

3. Open `http://localhost:8000` in your browser

## Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

To deploy manually:

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. GitHub Actions will automatically build and deploy to GitHub Pages

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Supabase (Backend & Real-time)
- GitHub Pages (Hosting)

## Configuration

Update `js/config.js` with your Supabase credentials:

```javascript
const SUPABASE_URL = 'your-project-url'
const SUPABASE_ANON_KEY = 'your-anon-key'
```

## License

MIT License

