const fs = require("fs");
const Telegraf = require("telegraf");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");

const functions = require("./functions");
const localization = require("./localization.json");
require("dotenv/config");

// bot instances
const bot = new Telegraf(process.env.TOKEN);

const dataGetterScene = new WizardScene(
    "data",
    functions.languageSelection,
    functions.fullnameGetter,
    functions.phoneNumberGetter,
    functions.schoolNumberGetter,
    functions.classGetter,
    functions.warningMessage
);

const stage = new Stage([dataGetterScene]); // Scene registration
bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) => {
    ctx.scene.enter("data");
});

bot.on("message", async (ctx) => {
    const check = functions.checkUser(ctx.chat.id);
    console.log(check);
    if (!check) {
        ctx.reply(`${localization.error.uz} \n\n${localization.error.ru}`);
    }

    const user = await ctx.telegram.getChatMember(
        "-1001514508351",
        ctx.chat.id
    );

    if (user.status !== "left") {
        ctx.reply(
            functions.createResultMessage(
                ctx.message.text,
                check?.language || "uz"
            )
        );
    } else {
        ctx.reply(
            "Natijangizni bilish uchun avval @IBM2007 kanaliga a'zo bo'ling va qayta urinib ko'ring!\n\nПодпишитесь на @IBM2007, чтобы увидеть свои результаты, и попробуйте еще раз!"
        );
    }
});

bot.launch();
