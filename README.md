
 █     █░ ▄▄▄       █████▒▄▄▄       ██▓ ██▓    ▓█████  ▄▄▄       ███▄    █
▓█░ █ ░█░▒████▄   ▓██   ▒▒████▄    ▓██▒▓██▒    ▓█   ▀ ▒████▄     ██ ▀█   █
▒█░ █ ░█ ▒██  ▀█▄ ▒████ ░▒██  ▀█▄  ▒██ ▒██░    ▒███   ▒██  ▀█▄  ▓██  ▀█ ██▒
░█░ █ ░█ ░██▄▄▄▄██░▓█▒  ░░██▄▄▄▄██ ░██░▒██░    ▒▓█  ▄ ░██▄▄▄▄██ ▓██▒  ▐▌██▒
░░██▒██▓  ▓█   ▓██▒░▒█░   ▓█   ▓██▒░██░░██████▒░▒████▒ ▓█   ▓██▒▒██░   ▓██░
░ ▓░▒ ▒   ▒▒   ▓▒█░ ▒ ░   ▒▒   ▓▒█░░▓  ░ ▒░▓  ░░░ ▒░ ░ ▒▒   ▓▒█░░ ▒░   ▒ ▒
  ▒ ░ ░    ▒   ▒▒ ░ ░      ▒   ▒▒ ░ ▒ ░░ ░ ▒  ░ ░ ░  ░  ▒   ▒▒ ░░ ░░   ░ ▒░
  ░   ░    ░   ▒    ░ ░    ░   ▒    ▒ ░  ░ ░      ░     ░   ▒      ░   ░ ░
    ░          ░  ░         ░  ░ ░      ░  ░   ░  ░       ░  ░         ░

# AhlconHub

A student‑built discussion forum for Ahlcon Public School, enabling students to report issues, upvote suggestions, and engage in threaded conversations.

---

## 📖 Table of Contents

- [✨ Features](#✨-features)  
- [🛠️ Tech Stack](#🛠️-tech-stack)  
- [🚀 Installation](#🚀-installation)  
- [👩‍💻 Usage](#👩‍💻-usage)  
- [🤝 Contributing](#🤝-contributing)  
- [📄 License](#📄-license)  

---

## ✨ Features

- 💬 **Discussion Threads** – Nested comments with upvote support  
- 👍 **Upvoting System** – Surface the most popular posts quickly  
- 🔒 **Authentication** – Secure sign‑in via Clerk  
- 🚀 **Real‑Time Updates** – Optimistic UI with React‑Toastify notifications  
- ⚙️ **Modular Design** – Extensible components and API routes  

---

## 🛠️ Tech Stack

| Frontend         | Backend              | Database      | Authentication    |
| ---------------- | -------------------- | ------------- | ----------------- |
| Next.js (App Dir)| Next.js API Routes   | PostgreSQL    | Clerk             |
| React & TypeScript| Prisma ORM          | Redis (cache) | JWT & OAuth       |
| React‑Toastify   | Node.js & Vercel Edge|               |                   |

---

## 🚀 Installation

1. **Clone the repository**  
```bash
git clone https://github.com/MaheshDhingra/AhlconHub.git
cd AhlconHub
```

2. **Set up environment variables**  
```bash
cp .env-example .env
# Fill in DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, etc.
```

3. **Install dependencies & generate Prisma client**  
```bash
npm install
npm run postinstall  # prisma generate
```

4. **Run locally**  
```bash
npm run dev
# Open http://localhost:3000
```

---

## 👩‍💻 Usage

```bash
# Create a new post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Feature Request","content":"Add dark mode"}'

# Upvote a post
curl -X POST http://localhost:3000/api/posts/1/upvote \
  -H "Authorization: Bearer <token>"
```

Preview screenshots, demos, and more usage examples in the `docs/` directory.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "feat: add new feature ✨"`)  
4. Push to your branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines and our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

