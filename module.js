const formatMessages = ["ability", "save", "skill"];
Hooks.on("renderChatMessage", (message, $html) => {
  const speaker = message.speaker.actor;
  const actor = game.actors.get(speaker);
  const $img = $(`<img src="${actor.img}" alt="${actor.name}" width="36" height="36" />`);
  const $flavorText = $html.find(".flavor-text");
  if (formatMessages.includes(message.flags.dnd5e.roll.type)) {
    const replaceText = game.i18n.localize("cr.replaceText");
    $flavorText.addClass("flavor-text-fr");
    if ($flavorText.text().includes(replaceText)) {
      $flavorText.text((index, currentText) => {
        return currentText.replace(`${replaceText} `, "");
      });
    }
    $flavorText.prepend($img);
    if (message.rolls[0] != null) {
      const roll = message.rolls[0];
      let advantageModeIcon = "";
      switch (roll.options.advantageMode) {
        case 1:
          advantageModeIcon = "upgrade";
          break;
        case -1:
          advantageModeIcon = "downgrade";
          break;
        default:
          advantageModeIcon = "";
          break;
      }
      if (advantageModeIcon !== "") {
        $flavorText.html((index, currentText) => {
          return currentText.replace(` (${game.i18n.localize("cr.advantage")})`, "").replace(` (${game.i18n.localize("cr.disadvantage")})`, "");
        });
        $html.find(".dice-formula").append(
          `<img src="icons/svg/${advantageModeIcon}.svg" class="fr-advantage-icon fr-advantage-icon--${advantageModeIcon}" width="24" height="24" />`
        );
      }
    }
  }
});
