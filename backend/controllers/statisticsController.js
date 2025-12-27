const { Resident, Household, sequelize } = require('../models');
const { Op } = require('sequelize');
const excel = require('exceljs');
const puppeteer = require('puppeteer'); 



// Hàm trợ giúp để tạo điều kiện lọc theo nhóm tuổi
const getAgeCondition = (ageGroup) => {
  if (!ageGroup) return null;

  // Ánh xạ lựa chọn từ frontend sang điều kiện của Sequelize
  const ageRanges = {
    '<18': { [Op.lt]: 18 },       // Nhỏ hơn 18
    '18-35': { [Op.between]: [18, 35] }, // Từ 18 đến 35
    '36-60': { [Op.between]: [36, 60] }, // Từ 36 đến 60
    '>60': { [Op.gt]: 60 }        // Lớn hơn 60
  };

  const range = ageRanges[ageGroup];
  if (!range) return null;

  // Sử dụng các hàm của PostgreSQL thông qua Sequelize để tính tuổi
  // Cú pháp này sẽ tạo ra câu lệnh SQL: DATE_PART('year', AGE(residents."date_of_birth"))
  return sequelize.where(
    sequelize.fn(
      'DATE_PART',
      'year',
      sequelize.fn('AGE', sequelize.col('date_of_birth'))
    ),
    range
  );
};

// Hàm chính để lấy dữ liệu thống kê nhân khẩu
exports.getResidentStats = async (req, res) => {
  try {
    const { area, gender, ageGroup } = req.query;

    const whereClause = {};         // Điều kiện cho bảng residents
    const householdWhereClause = {}; // Điều kiện cho bảng households

    // 1. Xây dựng điều kiện lọc cho bảng residents
    if (gender) {
      whereClause.gender = gender;
    }

    const ageCondition = getAgeCondition(ageGroup);
    if (ageCondition) {
      // Kết hợp điều kiện tuổi vào whereClause
      whereClause[Op.and] = (whereClause[Op.and] || []).concat(ageCondition);
    }
    
    // 2. Xây dựng điều kiện lọc cho bảng households (theo Khu vực)
    if (area) {
      householdWhereClause[Op.or] = [
        { apartmentCode: { [Op.iLike]: `%${area}%` } },
        { address: { [Op.iLike]: `%${area}%` } }
      ];
    }

    // 3. Thực hiện truy vấn, kết hợp cả 2 bảng
    const residents = await Resident.findAll({
      where: whereClause,
      include: {
        model: Household,
        where: householdWhereClause, // Lọc trên bảng được include
        attributes: ['apartmentCode']
      },
      order: [['fullName', 'ASC']]
    });

    res.status(200).json({ success: true, count: residents.length, data: residents });
  } catch (error) {
    console.error("LỖI KHI THỐNG KÊ NHÂN KHẨU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.getHouseholdStats = async (req, res) => {
  try {
    const { area, apartmentType, memberCount } = req.query;
    const whereClause = {};

    if (area) {
      whereClause[Op.or] = [
        { apartmentCode: { [Op.iLike]: `%${area}%` } },
        { address: { [Op.iLike]: `%${area}%` } }
      ];
    }
    if (apartmentType) {
      whereClause.apartmentType = apartmentType;
    }
    if (memberCount) {
      whereClause.memberCount = memberCount;
    }

    const filteredHouseholds = await Household.findAll({
      where: whereClause,
      order: [['apartmentCode', 'ASC']]
    });

    const householdCount = filteredHouseholds.length;
    const totalMemberCount = filteredHouseholds.reduce((sum, household) => {
      return sum + (Number(household.memberCount) || 0);
    }, 0);

    res.status(200).json({
      success: true,
      summary: { householdCount, totalMemberCount },
      data: filteredHouseholds
    });
  } catch (error) {
    console.error("LỖI KHI THỐNG KÊ HỘ KHẨU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.exportHouseholdStatsToExcel = async (req, res) => {
  try {
    // Lấy các tham số lọc từ query, logic giống hệt hàm getHouseholdStats
    const { area, apartmentType, memberCount } = req.query;
    const whereClause = {};
    if (area) whereClause[Op.or] = [{ apartmentCode: { [Op.iLike]: `%${area}%` } }, { address: { [Op.iLike]: `%${area}%` } }];
    if (apartmentType) whereClause.apartmentType = apartmentType;
    if (memberCount) whereClause.memberCount = memberCount;

    const households = await Household.findAll({ where: whereClause, order: [['apartmentCode', 'ASC']] });

    // Bắt đầu tạo file Excel
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('ThongKeHoKhau');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Mã Hộ khẩu', key: 'apartmentCode', width: 20 },
      { header: 'Tên Chủ hộ', key: 'ownerName', width: 30 },
      { header: 'Địa chỉ', key: 'address', width: 40 },
      { header: 'Loại Căn hộ', key: 'apartmentType', width: 20 },
      { header: 'Số Thành viên', key: 'memberCount', width: 15 },
      { header: 'Diện tích (m²)', key: 'area', width: 15 },
    ];
    worksheet.addRows(households);

    // Thiết lập header để trình duyệt tự động tải file về
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ThongKeHoKhau.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("LỖI KHI XUẤT EXCEL:", error);
    res.status(500).send('Lỗi khi tạo file Excel');
  }
};

exports.exportHouseholdStatsToPdf = async (req, res) => {
  let browser = null;
  try {
    // 1. Lấy dữ liệu với logic lọc tương tự như các hàm khác
    const { area, apartmentType, memberCount } = req.query;
    const whereClause = {};
    if (area) whereClause[Op.or] = [{ apartmentCode: { [Op.iLike]: `%${area}%` } }, { address: { [Op.iLike]: `%${area}%` } }];
    if (apartmentType) whereClause.apartmentType = apartmentType;
    if (memberCount) whereClause.memberCount = memberCount;
    const households = await Household.findAll({ where: whereClause, order: [['apartmentCode', 'ASC']] });

    // 2. Tạo nội dung HTML cho file PDF
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Báo cáo Thống kê Hộ khẩu</h1>
          <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          <table>
            <thead>
              <tr>
                <th>Mã Hộ khẩu</th><th>Tên Chủ hộ</th><th>Địa chỉ</th>
                <th>Loại Căn hộ</th><th>Số Thành viên</th><th>Diện tích (m²)</th>
              </tr>
            </thead>
            <tbody>
              ${households.map(h => `
                <tr>
                  <td>${h.apartmentCode || ''}</td><td>${h.ownerName || ''}</td>
                  <td>${h.address || ''}</td><td>${h.apartmentType || ''}</td>
                  <td>${h.memberCount || 0}</td><td>${h.area || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;


    // 3. Sử dụng Puppeteer để tạo PDF từ HTML
    console.log(">>>> Khởi động Puppeteer...");
    browser = await puppeteer.launch({
      headless: "new",
      // Thêm các args này để tăng tính tương thích, đặc biệt trên Windows và các môi trường bị hạn chế
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    });
    

    console.log(">>>> Đã khởi động Puppeteer. Đang tạo trang mới...");

    const page = await browser.newPage();
    console.log(">>>> Đã tạo trang mới. Đang set nội dung HTML...");
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    console.log(">>>> Đã set nội dung. Đang tạo PDF...");

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    console.log(">>>> Đã tạo PDF buffer thành công.");


    // 4. Thiết lập header và gửi file PDF về cho client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=BaoCaoHoKhau.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    // IN LỖI CHI TIẾT RA CONSOLE CỦA BACKEND
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!!! LỖI NGHIÊM TRỌNG KHI XUẤT PDF:", error);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    res.status(500).send({ success: false, message: 'Lỗi khi tạo file PDF.', error: error.message });
  } finally {
    // Luôn đảm bảo trình duyệt được đóng lại dù có lỗi hay không
    if (browser) {
      await browser.close();
      console.log(">>>> Đã đóng trình duyệt Puppeteer.");
    }
  }
};

// =================================================================
// HÀM MỚI: EXPORT THỐNG KÊ NHÂN KHẨU RA EXCEL
// =================================================================
exports.exportResidentStatsToExcel = async (req, res) => {
  try {
    // Logic lọc tương tự như getResidentStats
    const { area, gender, ageGroup } = req.query;
    const whereClause = {};
    const householdWhereClause = {};
    if (gender) whereClause.gender = gender;
    const ageCondition = getAgeCondition(ageGroup); // Dùng lại hàm helper
    if (ageCondition) whereClause[Op.and] = (whereClause[Op.and] || []).concat(ageCondition);
    if (area) householdWhereClause[Op.or] = [{ apartmentCode: { [Op.iLike]: `%${area}%` } }, { address: { [Op.iLike]: `%${area}%` } }];

    const residents = await Resident.findAll({
      where: whereClause,
      include: { model: Household, where: householdWhereClause, attributes: ['apartmentCode'] },
      order: [['fullName', 'ASC']]
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('ThongKeNhanKhau');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Họ và tên', key: 'fullName', width: 30 },
      { header: 'Ngày sinh', key: 'dateOfBirth', width: 15 },
      { header: 'Giới tính', key: 'gender', width: 15 },
      { header: 'Số CCCD', key: 'idCardNumber', width: 20 },
      { header: 'Quan hệ với chủ hộ', key: 'relationship', width: 25 },
      { header: 'Nghề nghiệp', key: 'occupation', width: 25 },
      { header: 'Thuộc Hộ khẩu', key: 'householdCode', width: 20 },
    ];

    // Xử lý dữ liệu để thêm cột 'householdCode'
    const dataToExport = residents.map(res => ({
      ...res.get({ plain: true }),
      householdCode: res.Household ? res.Household.apartmentCode : ''
    }));

    worksheet.addRows(dataToExport);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ThongKeNhanKhau.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("LỖI KHI XUẤT EXCEL NHÂN KHẨU:", error);
    res.status(500).send('Lỗi khi tạo file Excel');
  }
};

// =================================================================
// HÀM MỚI: EXPORT THỐNG KÊ NHÂN KHẨU RA PDF
// =================================================================
exports.exportResidentStatsToPdf = async (req, res) => {
  let browser = null;
  try {
    // Logic lọc tương tự như getResidentStats
    const { area, gender, ageGroup } = req.query;
    const whereClause = {};
    const householdWhereClause = {};
    if (gender) whereClause.gender = gender;
    const ageCondition = getAgeCondition(ageGroup);
    if (ageCondition) whereClause[Op.and] = (whereClause[Op.and] || []).concat(ageCondition);
    if (area) householdWhereClause[Op.or] = [{ apartmentCode: { [Op.iLike]: `%${area}%` } }, { address: { [Op.iLike]: `%${area}%` } }];

    const residents = await Resident.findAll({
      where: whereClause,
      include: { model: Household, where: householdWhereClause, attributes: ['apartmentCode'] },
      order: [['fullName', 'ASC']]
    });

    // Tạo nội dung HTML cho file PDF
    const htmlContent = `
      <html>
        <head><meta charset="UTF-8" /><style>body{font-family:Arial,sans-serif;font-size:10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background-color:#f2f2f2}h1{text-align:center;font-size:16px}</style></head>
        <body>
          <h1>Báo cáo Thống kê Nhân khẩu</h1>
          <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          <table>
            <thead><tr><th>Họ tên</th><th>Ngày sinh</th><th>Giới tính</th><th>Số CCCD</th><th>Quan hệ</th><th>Nghề nghiệp</th><th>Hộ khẩu</th></tr></thead>
            <tbody>
              ${residents.map(res => `
                <tr>
                  <td>${res.fullName || ''}</td>
                  <td>${res.dateOfBirth ? new Date(res.dateOfBirth).toLocaleDateString('vi-VN') : ''}</td>
                  <td>${res.gender || ''}</td>
                  <td>${res.idCardNumber || ''}</td>
                  <td>${res.relationship || ''}</td>
                  <td>${res.occupation || ''}</td>
                  <td>${res.Household ? res.Household.apartmentCode : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ThongKeNhanKhau.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("LỖI KHI XUẤT PDF NHÂN KHẨU:", error);
    res.status(500).send('Lỗi khi tạo file PDF');
  } finally {
    if (browser) await browser.close();
  }
};