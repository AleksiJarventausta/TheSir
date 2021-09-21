const { MessageActionRow, MessageButton } = require("discord.js");
const {
    getNicknameOrName,
    ButtonTypes,
    randomColor,
    InputTypes,
    randomInt,
} = require("../../util");

// Max 5 buttons per row, max 5 rows -> 25
// -1 for question
// -1 for rainbow mode
const MAX_BUTTONS = 23;
const MAX_BUTTONS_PER_ROW = 5;
const MAX_BUTTON_LABEL = 80;
const COMMAND_NAME = "poll";

const constants = {
    commandName: COMMAND_NAME,
    buttonTypes: [ButtonTypes.Primary, ButtonTypes.Success, ButtonTypes.Danger],
};

const poll = async (interaction) => {
    await interaction.deferReply();
    const buttons = createButtons(interaction);
    const actionRows = createActionRows(buttons);

    const title = interaction.options.getString("title");
    const user = getNicknameOrName(interaction);

    interaction.editReply({
        content: `${user} started a poll!`,
        components: actionRows,
        embeds: [
            {
                title: title,
                color: randomColor(),
                timestamp: new Date(),
            },
        ],
    });
};

const createActionRows = (buttons) => {
    const actionRows = [];
    for (
        let i = 0, limit = buttons.length;
        i < limit;
        i += MAX_BUTTONS_PER_ROW
    ) {
        const actionRow = new MessageActionRow();
        const row = buttons.slice(i, i + MAX_BUTTONS_PER_ROW);
        row.map((button) => actionRow.addComponents(button));
        actionRows.push(actionRow);
    }
    return actionRows;
};

const createButtons = (interaction) => {
    const indexes = Array(MAX_BUTTONS)
        .fill(0)
        .map((_, i) => i);

    const inputs = indexes.reduce((inputs, i) => {
        const input = interaction.options.getString(optionName(i));
        if (input) {
            const shortenedInput = input.slice(0, MAX_BUTTON_LABEL);
            inputs.push({
                id: `${inputs.length} ${shortenedInput}`,
                name: shortenedInput,
            });
        }
        return inputs;
    }, []);

    const rainbowMode = interaction.options.getBoolean("rainbow-mode");

    const buttons = inputs.map((input) =>
        createButton(
            input.id,
            input.name,
            rainbowMode ? getRandomButtonStyle() : undefined
        )
    );
    return buttons;
};

const createButton = (id, text, style = ButtonTypes.Primary) => {
    return new MessageButton({
        customId: `${COMMAND_NAME} ${id}`,
        label: text,
        style: style,
    });
};

const getRandomButtonStyle = () => {
    const randomValue = randomInt(0, constants.buttonTypes.length - 1);
    return constants.buttonTypes[randomValue];
};

const optionName = (index) => `option-${index + 1}`;

const createInputs = (numberOfInputs) => {
    const inputs = Array(numberOfInputs)
        .fill(0)
        .map((_, i) => ({
            type: 3,
            name: optionName(i),
            description: `${i + 1}. option`,
            required: i === 0,
        }));
    inputs.unshift({
        type: InputTypes.String,
        name: "title",
        description: "The title of the poll",
        required: true,
    });
    inputs.push({
        type: InputTypes.Boolean,
        name: "rainbow-mode",
        description: "🤗🌈",
        required: false,
    });
    return inputs;
};

module.exports = {
    data: {
        type: 1,
        name: COMMAND_NAME,
        description: "Create polls with your friends!",
        options: createInputs(MAX_BUTTONS),
    },
    constants: constants,
    async execute(interaction) {
        await poll(interaction);
    },
};