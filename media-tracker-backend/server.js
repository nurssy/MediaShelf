const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const categoryRouter = require('./routes/category'); // Router sadece bir kez import ediliyor

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basit test endpoint
app.get('/', (req, res) => {
  res.send('API çalışıyor 🚀');
});

// Router kullanımı
app.use('/api/categories', categoryRouter);

// MongoDB bağlantısı
mongoose.connect('mongodb://127.0.0.1:27017/media-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB bağlantısı başarılı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// Sunucu başlatma
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} üzerinde çalışıyor`);
});
