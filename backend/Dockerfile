# ใช้ Node.js runtime เป็น parent image
FROM node:20-alpine

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package.json .

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์อื่นๆ ของแอพ
COPY . .

# เปิดเผยพอร์ต 5000
EXPOSE 5000

# เริ่มต้นแอพ
CMD ["npm","run", "dev"]
