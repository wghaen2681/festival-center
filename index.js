/* eslint-disable space-before-function-paren */
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
      function areaI(message) {
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
      function monthIndex(message) {
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
      function sDeD(month_1, day_1, month_2, day_2) {
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
        date = sDeD(parseInt(date[0].substring(0, 1)), parseInt(date[0].substring(2, 3)), parseInt(date[1].substring(0, 1)), parseInt(date[1].substring(2, 3)))
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
      const response = await axios.get(
        `https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^${area}^^${month}^2021${date[0]}${date[1]}^2021${date[2]}${date[3]}`
      )
      const $ = cheerio.load(response.data)
      let reply = ''
      $('.columnBlock-title').each(function () {
        // console.log($(this).text().trim())
        // console.log($('.columnBlock-title').next().text().trim())
        reply += $(this).text().trim() + '\n'
        reply += $(this).next().text().trim() + '\n'
        reply += 'https://www.taiwan.net.tw/' + $(this).attr('href') + '\n'
        // reply += $(this) + '\n'

        reply += '\n'
      })
      console.log(reply)

      const flex = {
        type: 'flex',
        altText: 'Flex Message',
        contents: {
          type: 'carousel',
          contents: [
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: 'https://www.taiwan.net.tw/att/event/388b0f82-b621-4be2-8c5f-4dac47482d01.jpg',
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'text',
                            text: '台灣好湯-溫泉美食嘉年華',
                            weight: 'bold',
                            size: 'md',
                            wrap: true,
                            margin: 'none'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                              {
                                type: 'text',
                                text: '2020/10/21 ~ 2021/06/30',
                                wrap: true,
                                color: '#8c8c8c',
                                size: 'xs',
                                flex: 5
                              }
                            ]
                          }
                        ],
                        paddingBottom: '15px',
                        paddingTop: '5px'
                      },
                      {
                        type: 'text',
                        text:
                          '時序逐漸進入冬天，也正式宣告臺灣已進入溫泉泡湯旺季！臺灣得天獨厚，擁有冷泉、熱泉、濁泉、海底泉等多樣性泉質，是世界知名的溫泉勝地。 交通部觀光局自民國96年開始每年結合溫泉保健養生特色及現代人健康飲食需求，將臺灣「溫泉」及「美食」兩大觀光資源整合規劃推出「溫泉美食嘉年華」活動。該活動每年在全臺各地同時登場，並從全臺19個溫泉區選出啟動地點。 「溫泉美食嘉年華」不但讓國內遊客全臺溫泉區泡透透，處處都享優惠，對國際觀光客也是深具魅力，更是帶動秋冬臺灣溫泉旅遊熱潮的年度盛事。活動期間，全臺溫泉區都將陸續辦理溫泉美食系列活動，並整合全臺各縣市溫泉區上百家業者，集合各溫泉區景點、人文風情與特產介紹，推薦優質店家，同時更提供好康優惠陸續引爆泡湯話題。',
                        wrap: true,
                        size: 'xs'
                      }
                    ],
                    height: '200px'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: 'website',
                      uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001019&lid=080498'
                    }
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            },
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: 'https://www.taiwan.net.tw/att/event/0ea47e74-68bf-4db0-bb2c-5c20e8e164f9.jpg',
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'text',
                            text: '2021保生文化祭',
                            weight: 'bold',
                            size: 'md',
                            wrap: true,
                            margin: 'none'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                              {
                                type: 'text',
                                text: '4/15 ~ 6/27',
                                wrap: true,
                                color: '#8c8c8c',
                                size: 'xs',
                                flex: 5
                              }
                            ]
                          }
                        ],
                        paddingBottom: '15px',
                        paddingTop: '5px'
                      },
                      {
                        type: 'text',
                        text:
                          '走過2百多年歷史的大龍峒，以保安宮為中心，周邊老宅、古廟林立，是臺北市少數文化保存完整的傳統街區，據民俗學家林衡道調查，全臺供奉保生大帝的廟宇共300多座，大龍峒保安宮是其中最壯盛、香火最興旺的廟宇。保安宮以發揚「傳統」宗教民俗、建立開故顯新的「願景」及發展融合「新文化」循環，不斷在傳統的架構下創新是保安宮的目標，保安宮的廟宇建築、裝飾藝術與空間，用藝術的思維與方法，已創造了另一面向的生活美學空間；而保安宮的古蹟修復更獲2003聯合國教科文組織文化資產保存獎，獲得國際上的肯定。',
                        wrap: true,
                        size: 'xs'
                      }
                    ],
                    height: '200px'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: 'website',
                      uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001019&lid=080448'
                    }
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            },
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: 'https://www.taiwan.net.tw/att/event/36a84078-7842-42b4-b0fe-298be1852bee.jpg',
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: '2021客家桐花祭',
                        weight: 'bold',
                        size: 'md',
                        wrap: true,
                        margin: 'none'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                              {
                                type: 'text',
                                text: '即日起 ～ 2021/05/22',
                                wrap: true,
                                color: '#8c8c8c',
                                size: 'xs',
                                flex: 5
                              }
                            ]
                          }
                        ],
                        paddingBottom: '15px',
                        paddingTop: '5px'
                      },
                      {
                        type: 'text',
                        text:
                          '透過客家桐花祭的舉辦，以雪白桐花為意象，傳遞客家人敬天地、重山林之傳統，更以桐花、山林之美為表，客家文化、歷史人文為核心，展現客家絕代風華，讓桐花的花開花落有了不同的意義。透過桐花，我們可以看到桐花代表的自然之美，其次是桐花所象徵的人文之美，最後是桐花所反映的客家人生命之美，這三重的美感，不僅豐富了臺灣多元族群文化的內涵，也象徵了客家精神的生生不息；結合客庄自然生態、美食、景點及人文風情，體會各地客庄不同樣貌，藉由客家桐花祭的舉辦，了解客家文化，進而帶動產業，提升觀光人潮，根據2011年9月遠見雜誌「建國百年」大調查，「客家桐花祭」榮登「最能代表臺灣精神和文化」第七名（前十名為具有千百年歷史的「媽祖」、「中元」、「元宵」等），可見經歷數年的深耕，「客家桐花祭」已在國人心中生根，更受到大陸地區、香港、日本等國際旅客之關注，成為國際性觀光、節慶活動。 ※ 因應「嚴重特殊傳染性肺炎COVID-19(簡稱武漢肺炎)疫情影響」，有關2020客家桐花祭活動辦理情形，請參考客家桐花祭官網公告。  -->',
                        wrap: true,
                        size: 'xs'
                      }
                    ],
                    height: '200px'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: 'website',
                      uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001019&lid=080449'
                    }
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            }
          ]
        }
      }

      event.reply(flex)
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

// fs.writeFileSync('flex.json', JSON.stringify(flex2, null, 2))
// https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^^^12^20210304^20210506
// https://www.taiwan.net.tw/m1.aspx?sNo=0001019&keyString=^^^12^202134^202154
