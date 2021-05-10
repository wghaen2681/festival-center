/* eslint-disable camelcase */
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

// line 回報機器人啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      // console.log(event.message)
      // console.log(event.message.text)
      // console.log(event.message.type)

      // 切割訊息片段
      let messages = event.message.text.split(' ')
      console.log(messages)

      // 過濾空值訊息
      messages = messages.filter(message => {
        return message.length > 0
      })
      console.log(messages)

      // 設定區域回傳值函式
      function areaI (message) {
        if (message.includes('北部')) {
          return 1
        } else if (message.includes('中部')) {
          return 2
        } else if (message.includes('南部')) {
          return 3
        } else if (message.includes('東部')) {
          return 4
        } else {
          return 5
        }
      }

      // 設定月份判斷函式
      function monthIndex (message) {
        if (message.includes('十二')) {
          return 12
        } else if (message.includes('十一')) {
          return 11
        } else if (message.includes('十')) {
          return 10
        } else if (message.includes('九')) {
          return 9
        } else if (message.includes('八')) {
          return 8
        } else if (message.includes('七')) {
          return 7
        } else if (message.includes('六')) {
          return 6
        } else if (message.includes('五')) {
          return 5
        } else if (message.includes('四')) {
          return 4
        } else if (message.includes('三')) {
          return 3
        } else if (message.includes('二')) {
          return 2
        } else {
          return 1
        }
      }
      // 為什麼這樣不會回傳！
      // let text = '一2'
      // if (text.includes('3', '一')) {
      //     console.log('!')
      // }

      // 設定判斷開始與結束日期函式
      function sDeD (month_1, day_1, month_2, day_2) {
        const a = [month_1, day_1, month_2, day_2]
        const b = [month_2, day_2, month_1, day_1]
        if (month_1 < month_2) {
          return a
        } else if (month_1 > month_2) {
          return b
        } else if (month_1 === month_2) {
          if (day_1 < day_2) {
            return a
          } else {
            return b
          }
        }
      }

      // 從訊息片段抓出月份、日期和地區
      let month = 1
      let date = []
      let area = ''
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].includes('月')) {
          month = monthIndex(messages[i])
          console.log('月份在 ' + month)
        } else if (messages[i].includes('/')) {
          date.push(messages[i])
        } else {
          console.log(messages[i])
          area = areaI(messages[i])
          console.log('地區在 ' + area)
        }
      }
      console.log(date)
      // 為什麼下面這邊不能執行
      // let date = []
      // for (message of messages) {
      //     if (message.includes('月')) {
      //         let month = monthIndex(message)
      //         console.log( '月份在 ' + month)
      //     } else if (message.includes('/')) {
      //         date.push(message)
      //     } else {
      //         let area = message
      //         console.log( '地區在 ' + area )
      //     }
      // }
      // console.log(date)

      // 判斷開始日期和結束日期
      if (date.length === 2) {
        date = sDeD(
          parseInt(date[0].substring(0, 1)),
          parseInt(date[0].substring(2, 3)),
          parseInt(date[1].substring(0, 1)),
          parseInt(date[1].substring(2, 3))
        )
        console.log(date)
        for (let i = 0; i < date.length; i++) {
          if (date[i].toString().length < 2) {
            date[i] = '0' + date[i]
          }
        }
        console.log(date)
      } else if (date.length > 2) {
        console.log('無法辨識輸入的開始日期與結束日期，輸入日期應小於兩個')
      }

      // 抓取網站連結
      console.log(`https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^${area}^^${month}^2021${date[0]}${date[1]}^2021${date[2]}${date[3]}`)
      const response = await axios.get(`https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^${area}^^${month}^2021${date[0]}${date[1]}^2021${date[2]}${date[3]}`)
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

// https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^^^12^20210304^20210506
// https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^^^12^202134^202154
