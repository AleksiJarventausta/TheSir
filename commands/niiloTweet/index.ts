import { Message } from "discord.js";
import T from "../../utils/TwitterClient";
const MAX_TWEETS = 100;

const path = "statuses/user_timeline";
const parameters = {
    screen_name: "niilo222",
    count: MAX_TWEETS,
    tweet_mode: "extended",
};

const getNiiloTweet = async (message: Message) => {
    try {
        getTweetsAndSendOneToDiscord(message);
    } catch (error) {
        message.channel.send("Vituiks meni!");
        console.log(error);
    }
};

function getTweetsAndSendOneToDiscord(message: Message) {
    if (!T) return;

    T.get(path, parameters, function (err, data, response) {
        if (err) {
            console.log("Requested:", "Received error from Twitter API:", err);
            return;
        }
        const tweet = getRandomTweet(data);
        sendTweetToDiscord(tweet, message);
    });
}

function getRandomTweet(tweets) {
    return tweets[randomNumber(0, MAX_TWEETS)];
}

const randomNumber = (start, end) => {
    return Math.floor(Math.random() * (start - end + 1)) + end;
};

function sendTweetToDiscord(tweet, message) {
    const embed = createAnswerMessage(tweet);
    message.channel.send({ embed: embed });
}

function createAnswerMessage(tweet) {
    let answerMessage = {
        description:
            "Niilo22 twiittasi " +
            parseDate(tweet.created_at) +
            ":\n\n" +
            tweet.full_text,
        image: {
            url: "",
        },
    };

    if (tweet.entities.media) {
        answerMessage = {
            description:
                "Niilo22 twiittasi " +
                parseDate(tweet.created_at) +
                ":\n\n" +
                tweet.full_text,
            image: { url: tweet.entities.media[0].media_url },
        };
    }

    return answerMessage;
}

function parseDate(date) {
    const datetime = new Date(date);
    datetime.setHours(datetime.getHours() + 2);

    let parsedDate = "";

    const weekday = datetime.getDay().toString();
    const month = datetime.getMonth().toString();
    const day = datetime.getDate().toString();
    let hour = datetime.getHours().toString();
    if (hour.length < 2) {
        hour = "0" + hour;
    }
    let minute = datetime.getMinutes().toString();
    if (minute.length < 2) {
        minute = "0" + minute;
    }
    const time = hour + ":" + minute;
    const year = datetime.getFullYear().toString();

    parsedDate =
        parseWeekday(weekday) +
        " " +
        parseDay(day) +
        " " +
        parseMonth(month) +
        " " +
        year +
        " klo " +
        parseTime(time);

    return parsedDate;
}

function parseTime(time) {
    let parsedTime = "";
    if (time.length < 5) {
        parsedTime = "0" + time;
    } else {
        parsedTime = time;
    }

    return parsedTime;
}

function parseWeekday(weekday) {
    let parsedWeekday = "";
    const weekdaysFin = [
        "sunnuntaina",
        "maanantaina",
        "tiistaina",
        "keskiviikkona",
        "torstaina",
        "perjantaina",
        "lauantaina",
    ];

    const NUMBER_OF_WEEKDAYS = 7;
    for (let i = 0; i < NUMBER_OF_WEEKDAYS; i++) {
        if (weekday == i) {
            parsedWeekday = weekdaysFin[i];
            break;
        }
    }

    return parsedWeekday;
}

function parseMonth(month) {
    let parsedMonth = "";
    const monthsFin = [
        "tammikuuta",
        "helmikuuta",
        "maaliskuuta",
        "huhtikuuta",
        "toukokuuta",
        "kesäkuuta",
        "heinäkuuta",
        "elokuuta",
        "syyskuuta",
        "lokakuuta",
        "marraskuuta",
        "joulukuuta",
    ];

    const NUMBER_OF_MONTHS = 12;
    for (let i = 0; i < NUMBER_OF_MONTHS; i++) {
        if (month == i) {
            parsedMonth = monthsFin[i];
            break;
        }
    }

    return parsedMonth;
}

function parseDay(day) {
    let parsedDay = day;
    if (startsWithZero(day)) {
        parsedDay = removeZero(day);
    }
    parsedDay = addDot(parsedDay);
    return parsedDay;
}

function startsWithZero(day) {
    if (day.slice(0, 1) == "0") {
        return true;
    } else {
        return false;
    }
}

function removeZero(day) {
    return day.slice(1, 2);
}

function addDot(day) {
    return day + ".";
}

export default {
    data: {
        name: ["niilo22", "niilo"],
        description: "Gets the best random Niilo22 tweets",
    },
    async execute(message: Message) {
        await getNiiloTweet(message);
    },
};
