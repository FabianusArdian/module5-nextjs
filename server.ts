import jsonServer from 'json-server';
import path from 'path';
import { Request, Response } from 'express';
import fs from 'fs';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser); // Memungkinkan parsing JSON body

// Fungsi untuk membaca dan menulis ke db.json
const getDbData = () => {
  const dbFilePath = path.join(__dirname, 'db.json');
  const dbData = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(dbData);
};

const writeDbData = (data: any) => {
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Endpoint untuk register
server.post('/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const db = getDbData();
  const users = db.users || [];

  // Cek apakah pengguna dengan email yang sama sudah ada
  const existingUser = users.find((user: any) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Buat pengguna baru
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
  };

  // Tambahkan pengguna baru ke database
  users.push(newUser);
  db.users = users;
  writeDbData(db);

  res.status(201).json(newUser);
});

// Endpoint untuk login
server.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDbData();
  const users = db.users || [];

  // Cari pengguna berdasarkan email dan password
  const user = users.find((user: any) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Kembalikan data pengguna (tanpa kata sandi)
  const { password: userPassword, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
});

// Tambahkan resource JSON Server lainnya
server.use(router);

// Tentukan port server (gunakan 5000 jika tidak ada port dari env)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
