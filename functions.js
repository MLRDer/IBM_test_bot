const localization = require("./localization.json");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const axios = require("axios");
const fs = require("fs");

require("dotenv/config");

// test results
const testResults = require("./results.json");

const phoneNumberValidator = (text) => {
    const regexp = /[0-9]/g;

    if (
        (text.length == 9 && text.match(regexp).length == 9) ||
        (text.length == 12 && text.match(regexp).length == 12) ||
        (text.length == 13 && text.match(regexp).length == 12 && text[0] == "+")
    ) {
        return true;
    } else {
        return false;
    }
};

function getUserData(id, user) {
    let obj = require("./users.json");

    if (obj[id]) {
        return obj[id];
    } else if (user == null) {
        return false;
    } else {
        obj[id] = user;
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile("users.json", json, function (err, result) {
            if (err) console.log("error", err);
        }); // write it back
        return user;
    }
}

exports.createResultMessage = (text, language) => {
    if (testResults && testResults[text]) {
        let message;
        if (language == "uz") {
            message = "Sizning natijangiz:\n\n";
            message += `📌 Variant:     ${testResults[text].variant}\n`;
            message += `🌟 Umumiy ball: ${testResults[text].overall}\n\n`;

            testResults[text].subjects.forEach((subject) => {
                if (subject && subject.name && subject.score) {
                    message += `${subject.name}:\n`;
                    message += `✅ To'g'ri javoblar soni: ${subject.correct} ta\n`;
                    message += `❌ Noto'g'ri javoblar soni: ${subject.incorrect} ta\n`;
                    message += `⭐️ To'plangan ball: ${subject.score} \n`;
                    message += `🧨 Noto'g'ri javoblar: ${subject.wrong_answers}\n\n`;
                }
            });
        } else {
            message = "Ваш результат:\n\n";
            message += `📌 Вариант:   ${testResults[text].variant}\n`;
            message += `🌟 Общий балл: ${testResults[text].overall}\n\n`;

            testResults[text].subjects.forEach((subject) => {
                if (subject && subject.name && subject.score) {
                    message += `${subject.name}:\n`;
                    message += `✅ Количество правильных ответов: ${subject.correct} \n`;
                    message += `❌ Количество неправильных ответов: ${subject.incorrect} \n`;
                    message += `⭐️ Накопленные баллы: ${subject.score} \n`;
                    message += `🧨 Неправильные ответы: ${subject.wrong_answers}\n\n`;
                }
            });
        }

        return message;
    } else {
        if (language == "uz") {
            return `"${text}" ga aloqador natija topilmadi!`;
        } else {
            return `По запросу "${text}" ничего не найдено!`;
        }
    }
};

exports.languageSelection = (ctx) => {
    ctx.reply(
        `Salom ${ctx.from.first_name}, tilni tanlang:\nПривет ${ctx.from.first_name}, выберите язык:`,
        Markup.keyboard([["O'zbek", "Pусский"]])
            .oneTime()
            .resize()
            .extra()
    );

    // next stage
    return ctx.wizard.next();
};

exports.fullnameGetter = (ctx) => {
    if (!ctx.wizard.state.language) {
        let language = ctx.message.text;
        if (language == "O'zbek") language = "uz";
        else if (language == "Pусский") language = "ru";
        else {
            ctx.reply(
                `${localization.option_error.uz}\n${localization.option_error.ru}`
            );
            ctx.wizard.back();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }

        ctx.wizard.state.language = language;
    }

    ctx.reply(localization.name[ctx.wizard.state.language || "uz"]);

    // next stage
    return ctx.wizard.next();
};

exports.phoneNumberGetter = (ctx) => {
    ctx.wizard.state.fullname = ctx.message.text;

    ctx.reply(
        localization.phone[ctx.wizard.state.language],
        Extra.markup((markup) => {
            return markup
                .keyboard([
                    markup.contactRequestButton(
                        localization.my_number[ctx.wizard.state.language]
                    ),
                ])
                .resize();
        })
    );

    // next stage
    return ctx.wizard.next();
};

exports.schoolNumberGetter = (ctx) => {
    if (!ctx.wizard.state.phone) {
        if (ctx.message.contact)
            ctx.wizard.state.phone = ctx.message.contact.phone_number;
        else {
            if (phoneNumberValidator(ctx.message.text)) {
                ctx.wizard.state.phone = ctx.message.text;
            } else {
                ctx.reply(
                    `${localization.phone_error[ctx.wizard.state.language]}`
                );
                ctx.wizard.back();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
        }
    }

    ctx.reply(localization.school[ctx.wizard.state.language || "uz"], {
        reply_markup: { remove_keyboard: true },
    });

    // next stage
    return ctx.wizard.next();
};

exports.classGetter = (ctx) => {
    ctx.wizard.state.school = ctx.message.text;

    ctx.reply(localization.class[ctx.wizard.state.language || "uz"]);

    // next stage
    return ctx.wizard.next();
};

exports.warningMessage = async (ctx) => {
    try {
        ctx.wizard.state.class = ctx.message.text;
        ctx.wizard.state.id = ctx.chat.id;

        let user = getUserData(ctx.chat.id, ctx.wizard.state);
        console.log(user);
        ctx.reply(localization.warning[ctx.wizard.state.language || "uz"]);

        // leave context
        return ctx.scene.leave();
    } catch (err) {
        console.log(err);
        ctx.reply(localization.error[ctx.wizard.state.language || "uz"]);
        ctx.reply(err);
    }
};

exports.checkUser = (user_id) => {
    return getUserData(user_id, null);
};
