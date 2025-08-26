const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testUsers = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: '123456',
    fullName: 'Test User'
  },
  {
    username: 'demo',
    email: 'demo@example.com',
    password: '123456',
    fullName: 'Demo User'
  }
];

async function seedUsers() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediashelf', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB bağlantısı başarılı');

    // Mevcut kullanıcıları temizle
    await User.deleteMany({});
    console.log('🗑️ Mevcut kullanıcılar temizlendi');

    // Test kullanıcılarını ekle
    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ ${createdUsers.length} test kullanıcısı eklendi:`);
    
    createdUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });

    console.log('\n🎯 Test kullanıcı bilgileri:');
    console.log('   Kullanıcı adı: testuser, Şifre: 123456');
    console.log('   Kullanıcı adı: demo, Şifre: 123456');

  } catch (error) {
    console.error('❌ Seed hatası:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

seedUsers();
