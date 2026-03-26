const https = require('https');

const options = {
  hostname: 'openrouter.ai',
  port: 443,
  path: '/api/v1/models',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer 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',
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', d => {
    data += d;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.data) {
        const freeModels = json.data
          .filter(m => m.id.includes(':free'))
          .map(m => m.id);
        console.log("DANH SÁCH MODEL MIỄN PHÍ CỦA BẠN:");
        console.log(JSON.stringify(freeModels.slice(0, 15), null, 2));
      } else {
        console.log("Không tìm thấy model nào. Phản hồi gốc:", data);
      }
    } catch (e) {
      console.log("Lỗi parse JSON:", e.message);
    }
  });
});

req.on('error', error => {
  console.error("Lỗi kết nối:", error.message);
});

req.end();
