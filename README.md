# 🎮 GameHatch - Gaming E-Commerce Platform

<div align="center">

![GameHatch Banner](https://via.placeholder.com/1200x300/0f172a/06B6D4?text=GameHatch+-+Your+Ultimate+Gaming+Store)

**A Modern Gaming Platform with Stunning Cyberpunk Design**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Table of Contents

- [What is GameHatch?](#-what-is-gamehatch)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
  - [Step 1: Download the Project](#step-1-download-the-project)
  - [Step 2: Install Required Software](#step-2-install-required-software)
  - [Step 3: Setup Frontend](#step-3-setup-frontend)
  - [Step 4: Setup Backend](#step-4-setup-backend)
  - [Step 5: Run the Application](#step-5-run-the-application)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 What is GameHatch?

**GameHatch** is a complete gaming e-commerce website where users can:
- 🎮 Browse and search for games
- 🛒 Add games to shopping cart
- ❤️ Save favorite games to wishlist
- ⭐ Write and read game reviews
- 📊 View review analytics with interactive charts
- 📄 Export wishlist to Word documents
- 💳 Make secure payments (Stripe integration)

The website features a **futuristic cyberpunk design** with neon colors, smooth animations, and works perfectly on all devices (mobile, tablet, desktop).

---

## ✨ Features

### 🎮 For Users
- **Browse Games**: View hundreds of games with beautiful cards
- **Search & Filter**: Find games by name, category, platform, or price
- **Shopping Cart**: Add games to cart and checkout
- **Wishlist**: Save your favorite games and export as Word
- **Reviews**: Rate games and write detailed reviews
- **Analytics**: See what others think with interactive charts
- **User Account**: Login, signup, and manage your profile

### 🎨 Design Features
- **Cyberpunk Theme**: Neon cyan and purple colors with glowing effects
- **Smooth Animations**: Everything moves beautifully
- **Responsive**: Works on phones, tablets, and computers
- **Dark Mode**: Easy on the eyes
- **Modern UI**: Clean and professional design

---

## 📸 Screenshots

> Add your screenshots here

---

## 📋 Prerequisites

Before you start, make sure you have these installed on your computer:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" version
   - Installation is straightforward - just click "Next" through the installer

2. **Visual Studio Code** (Recommended)
   - Download from: https://code.visualstudio.com/
   - Best code editor for this project

3. **.NET 7.0 SDK** (For backend)
   - Download from: https://dotnet.microsoft.com/download/dotnet/7.0
   - Choose the SDK (not Runtime)

4. **SQL Server** (For database)
   - Download SQL Server Express (Free): https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Also install SQL Server Management Studio (SSMS): https://aka.ms/ssmsfullsetup

5. **Git** (For downloading the project)
   - Download from: https://git-scm.com/downloads
   - Use default settings during installation

### How to Check if Software is Installed

Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux) and type:

```bash
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check .NET
dotnet --version
# Should show: 7.x.x

# Check Git
git --version
# Should show: git version 2.x.x
```

---

## 🚀 Installation Guide

### Step 1: Download the Project

#### Option A: Using Git (Recommended)

1. **Open Command Prompt or Terminal**

2. **Navigate to where you want to save the project**
   ```bash
   # Example: Go to Desktop
   cd Desktop
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gamehatch.git
   ```

4. **Enter the project folder**
   ```bash
   cd gamehatch
   ```

#### Option B: Download ZIP

1. Go to the GitHub repository
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to your desired location
5. Open the extracted folder

---

### Step 2: Install Required Software

Make sure you have installed all software from the [Prerequisites](#-prerequisites) section above.

---

### Step 3: Setup Frontend

1. **Open Command Prompt/Terminal**

2. **Navigate to the frontend folder**
   ```bash
   cd GameHatch--Frontend
   ```

3. **Install all dependencies**
   ```bash
   npm install
   ```
   
   ⏱️ This will take 2-5 minutes. You'll see a progress bar.

4. **Create environment file**
   
   Create a new file named `.env` in the `GameHatch--Frontend` folder with this content:
   ```env
   VITE_API_BASE_URL=https://localhost:7270
   ```

   **How to create .env file:**
   - Right-click in the folder → New → Text Document
   - Name it `.env` (remove the .txt extension)
   - Open with Notepad and paste the content above
   - Save and close

5. **Verify installation**
   ```bash
   npm run dev
   ```
   
   If you see something like:
   ```
   VITE v7.1.2  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ```
   
   ✅ Frontend is ready! Press `Ctrl+C` to stop for now.

---

### Step 4: Setup Backend

1. **Open a NEW Command Prompt/Terminal window**

2. **Navigate to the backend folder**
   ```bash
   cd GameHatch--Backend
   ```

3. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

4. **Update database connection**
   
   Open `appsettings.json` file and update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=GameHatch;Integrated Security=True;TrustServerCertificate=True"
     }
   }
   ```

5. **Create the database**
   ```bash
   dotnet ef database update
   ```
   
   If you get an error about `dotnet ef`, install it:
   ```bash
   dotnet tool install --global dotnet-ef
   ```
   
   Then try the database update command again.

6. **Run the backend**
   ```bash
   dotnet run
   ```
   
   If you see:
   ```
   Now listening on: https://localhost:7270
   ```
   
   ✅ Backend is ready!

---

### Step 5: Run the Application

Now you need **TWO terminal windows open**:

#### Terminal 1 - Backend
```bash
cd GameHatch--Backend
dotnet run
```
Keep this running!

#### Terminal 2 - Frontend
```bash
cd GameHatch--Frontend
npm run dev
```
Keep this running too!

#### Access the Website

Open your web browser and go to:
```
http://localhost:5173
```

🎉 **Congratulations! GameHatch is now running!**

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH
- Reinstall Node.js from https://nodejs.org/
- Restart your computer
- Try again

#### ❌ "dotnet is not recognized"
**Solution:** .NET SDK is not installed
- Install .NET 7.0 SDK from https://dotnet.microsoft.com/download
- Restart your computer

#### ❌ "Port 5173 is already in use"
**Solution:** Another app is using that port
- Close other applications
- Or change the port in `vite.config.js`

#### ❌ "Cannot connect to database"
**Solution:** SQL Server is not running
- Open SQL Server Configuration Manager
- Start SQL Server service
- Check connection string in `appsettings.json`

#### ❌ "npm install fails"
**Solution:** Try these steps:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules folder
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Install again
npm install
```

#### ❌ Backend shows SSL certificate error
**Solution:** Trust the development certificate
```bash
dotnet dev-certs https --trust
```

### Still Having Issues?

1. Make sure all prerequisites are installed
2. Check if you're in the correct folder
3. Try restarting your computer
4. Check the error message carefully
5. Google the error message
6. Ask for help in the Issues section

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Framer Motion** - Animation library
- **React Router** - Navigation
- **Axios** - HTTP requests
- **React Toastify** - Notifications
- **jsPDF** - PDF generation
- **docx** - Word document generation

### Backend
- **.NET 7** - Backend framework
- **Entity Framework Core** - Database ORM
- **SQL Server** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing

---

## 📁 Project Structure

```
GameHatch/
│
├── GameHatch--Frontend/          # React Frontend
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── Components/           # Reusable UI components
│   │   ├── Context/              # React Context (state management)
│   │   ├── pages/                # Page components
│   │   ├── Redux/                # Redux store
│   │   ├── services/             # API services
│   │   ├── utils/                # Helper functions
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .env                      # Environment variables
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite configuration
│
└── GameHatch--Backend/           # .NET Backend
    ├── Controllers/              # API endpoints
    ├── Models/                   # Database models
    ├── Data/                     # Database context
    ├── Services/                 # Business logic
    ├── appsettings.json          # Configuration
    └── Program.cs                # Entry point
```

---

## 📚 How to Use the Website

### For First-Time Users

1. **Create an Account**
   - Click "Login" in the top-right corner
   - Click "Sign Up"
   - Fill in your details
   - Click "Create Account"

2. **Browse Games**
   - Click "Games" in the navigation bar
   - Scroll through the game catalog
   - Use search to find specific games
   - Use filters to narrow down choices

3. **Add to Cart**
   - Click on a game card
   - Click "Add to Cart" button
   - View cart by clicking the cart icon (top-right)

4. **Add to Wishlist**
   - Click the heart icon on any game card
   - View wishlist by clicking "Wishlist" in navigation
   - Export your wishlist as Word document

5. **Write Reviews**
   - Go to a game's detail page
   - Scroll to the review section
   - Rate the game (1-5 stars)
   - Write your review
   - Select tags (Gameplay, Graphics, Story, etc.)
   - Submit

6. **View Analytics**
   - On the review page, see interactive charts
   - View sentiment analysis (Positive/Negative/Mixed)
   - See feature breakdowns (Graphics, Gameplay, etc.)

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'primary': '#06B6D4',    // Change cyan color
      'secondary': '#8B5CF6',  // Change purple color
    }
  }
}
```

### Change Logo

Replace the logo image in:
```
public/images/Gemini_Generated_Image_655v1w655v1w655v-removebg-preview.png
```

---

## 🤝 Contributing

Want to contribute? Great! Here's how:

1. **Fork the repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add some feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```
6. **Create a Pull Request**

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- **Your Name** - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Thanks to all open-source contributors
- React team for the amazing framework
- Tailwind CSS for the styling system
- All the developers who helped

---

## 📞 Support

Need help? Here's how to get support:

1. **Check the [Troubleshooting](#-troubleshooting) section**
2. **Search existing [Issues](https://github.com/yourusername/gamehatch/issues)**
3. **Create a new Issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Screenshots (if applicable)
   - Your system information (OS, Node version, etc.)

---

## 🎯 Future Features

- [ ] Social login (Google, Facebook)
- [ ] Game recommendations based on preferences
- [ ] Live chat support
- [ ] Multiple payment methods
- [ ] Game trailers and screenshots
- [ ] User achievements and badges
- [ ] Mobile app (React Native)

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star!

**Made with ❤️ and lots of ☕**

[Report Bug](https://github.com/yourusername/gamehatch/issues) · [Request Feature](https://github.com/yourusername/gamehatch/issues)

</div>