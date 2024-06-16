async function handleUsername(bot, chatId, userId, username) {
  const buttons = [
    [{ text: 'Play', web_app: { url: 'https://84ca-45-126-3-252.ngrok-free.app' } }],
    // [{ text: 'Go to Go! AI-RPG', url: 'https://ton.app/social/go!-app?id=1349' }],
    // [{ text: 'X(Twitter)', url: 'https://x.com/gorwachain' }],
    // [{ text: 'Telegram', url: 'https://t.me/gorwachain' }],
    // [{ text: 'Discord', url: 'https://discord.com/gorwachain' }],
    // [{ text: 'Website', url: 'https://www.goplatform.io/' }],
  ];
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const eyesEmoji = '\uD83D\uDC40'; // 👀
  const playGuitarEmoji = '\uD83C\uDFB8'; // 🎸
  const gemEmoji = '\uD83D\uDC8E'; // 💎
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const text = `Welcome to our Rune Force game, ${username}!\n
What can this bot do?\n
${eyesEmoji} Click Start below\n
${playGuitarEmoji} Play the guitar! token to collect rewards\n
${gemEmoji} Earn up to 50 XATOMs daily by tapping\n
${giftEmoji} Complete social tasks and invite friends for more rewards\n
XATOM is your gateway to rewards and adventures! ${rocketEmoji}`

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: buttons,
    }
  }
  )
}

module.exports = {
  handleUsername,
};