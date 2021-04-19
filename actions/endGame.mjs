const endGame = async (message) => {
  const m = await message.channel.send({
    embed: {
      description: "END",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      color: "#ec4999",
      fields: [
        {
          name: "Rank",
          value: "1st to last",
        },
        {
          name: "1/7 : Beelphiew#0000",
          value: "102pts",
        },
        {
          name: "2/7 : Dral#0000",
          value: "82pts",
        },
        {
          name: "3/7 : Flo#0000",
          value: "62pts",
        },
        {
          name: "4/7 : Lolibam#0000",
          value: "42pts",
        },
        {
          name: "5/7 : Orsk#0000",
          value: "22pts",
        },
        {
          name: "6/7 : Tenshi#0000",
          value: "2pts",
        },
        {
          name: "7/7 : Vikanya#0000",
          value: "0pts",
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Thank you for using Yu 🌸',
      },
    }
  })
  m.react("👏");
}

export default endGame;
