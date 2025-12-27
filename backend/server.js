// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
 // Đảm bảo file config/db.js tồn tại và đúng
const mainRouter = require('./routes');   // Đảm bảo file routes/index.js tồn tại và đúng
require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Sử dụng router chính với tiền tố /api
app.use('/api', mainRouter);

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('>>>> Kết nối CSDL thành công!');

    // THAY ĐỔI Ở ĐÂY: Thêm '0.0.0.0'
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`>>>> Server đang chạy và lắng nghe tại:`);
      console.log(`     - Local:   http://localhost:${PORT}`);
      console.log(`     - Network: http://192.168.1.217:${PORT}`); // Thay IP của bạn vào đây để tiện copy
    });
  } catch (error) {
    console.error('!!! LỖI: Không thể kết nối đến CSDL:', error.message);
  }
};

startServer();