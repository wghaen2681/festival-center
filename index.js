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
      console.log(event.message)
      // const message = event.message.split(' ')
      // console.log(message)

      const response = await axios.get('https://www.taiwan.net.tw/m1.aspx?sNo=0001019&page=1')
      // const response = await axios.get(`https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=${keyword}^${area}^^${month}^${star_date}^${end_date}`)
      const $ = cheerio.load(response.data)
      let reply = ''
      $('.columnBlock-title').each(function () {
        // console.log($(this).text().trim())
        // console.log($('.columnBlock-title').next().text().trim())
        reply += $(this).text().trim() + '\n'
        reply += $(this).next().text().trim() + '\n\n'
      })
      console.log(reply)
      event.reply(reply)
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})
