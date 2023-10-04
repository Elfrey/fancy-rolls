const formatMessages = ["ability", "save", "skill", "check"];
Hooks.on("renderChatMessage", async (message, $html) => {
  const speaker = message.speaker.actor;
  const actor = game.actors.get(speaker);
  if (actor == null)
    return;
  const tokenImg = actor.prototypeToken.texture.src;
  const $img = $(`<img src="${tokenImg}" alt="${actor.name}" title="${actor.name}" width="36" height="36" />`);
  const $flavorText = $html.find(".flavor-text");
  if (formatMessages.includes(message.flags.dnd5e.roll.type)) {
    const replaceText = game.i18n.localize("cr.replaceText");
    $flavorText.addClass("flavor-text-fr");
    if ($flavorText.text().includes(replaceText)) {
      $flavorText.text((_, currentText) => {
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
        const currentModText = roll.options.advantageMode === 1 ? game.i18n.localize("cr.advantage") : game.i18n.localize("cr.disadvantage");
        $flavorText.html((_, currentText) => {
          return currentText.replace(` (${game.i18n.localize("cr.advantage")})`, "").replace(` (${game.i18n.localize("cr.disadvantage")})`, "");
        });
        $html.find(".dice-formula").append(
          `<img src="icons/svg/${advantageModeIcon}.svg" class="fr-advantage-icon fr-advantage-icon--${advantageModeIcon}" title="${currentModText}" alt="${currentModText}" width="24" height="24" />`
        );
      }
    }
  }
});