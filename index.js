import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import cheerio from 'cheerio'

// 讓套件讀取 .env 檔案
// 讀取後可以用 process.env.變數 使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const response = await axios.get('https://www.taiwan.net.tw/m1.aspx?sNo=0001019&page=1')
      const $ = cheerio.load(response.data)
      let reply = ''
      $('.columnBlock-title').each(function () {
        console.log($(this).text())
        reply += $(this).text() + '\n'
      })
      console.log(reply)
      event.reply(reply)
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

// const data = response.data.filter(data => {
//   return data['花種'] === event.message.text
// })

// let reply = ''
// for (const d of data) {
//   reply += `地點:${d['地點']} \n地址:${d['地址']} \n觀賞時期:${d['觀賞時期']} \n\n`
// }
// ..
