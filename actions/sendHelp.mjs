const sendHelp = async (message) => {
  message.channel.send({
    embed: {
      description: "Below you can see all the commands I know",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      color: "#ec4999",
      fields: [
        {
          name: "Blind test",
          value: "Simply use `!blindtest`",
        },
      ],
    }
  })
}

export default sendHelp;
