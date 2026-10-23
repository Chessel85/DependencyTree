/** Keyboard help: every navigator keystroke, in a table (DES-KEY-007). Keys are for the list unless it says otherwise. */
export class HelpDialog {
  constructor(
    private readonly dialog: HTMLDialogElement,
    content: HTMLElement,
    closeButton: HTMLButtonElement,
    listModifierName: string,
    onClose: () => void,
  ) {
    content.replaceChildren(this.table(listModifierName));
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', onClose);
  }

  open(): void {
    this.dialog.showModal();
  }

  private table(listModifierName: string): HTMLTableElement {
    const rows: [string, string][] = [
      ['Tab and Shift+Tab', 'Move between the summary, the description, the tabs and the list.'],
      ['Left Arrow', 'When the Dependencies list is active, go to its highlighted entry, earlier in time. A sound plays if the list is empty.'],
      ['Right Arrow', 'When the Enabled list is active, go to its highlighted entry, later in time. A sound plays if the list is empty.'],
      ['Enter', 'Go to the highlighted entry in the active list. On a period, go into the highlighted moment.'],
      ['Up Arrow and Down Arrow', 'Move through the active list.'],
      ['Home and End', 'Go to the first or last entry in the active list.'],
      [`${listModifierName}+Left Arrow and ${listModifierName}+Right Arrow`, 'In the list, go to the previous or next tab.'],
      ['Backspace', 'Go back one step along the path you took. Works anywhere in the card.'],
      ['Space', 'Summary of the current entry.'],
      ['D', 'Description.'],
      ['T', 'Tags.'],
      ['L', 'Location.'],
      ['P', 'The path you took.'],
      ['Slash', 'The index, to find any entry and go to it. Type to narrow the list, Down Arrow to move into it, and Enter to go. Escape closes it. Works anywhere in the card.'],
      ['Question mark', 'This help. Escape closes it.'],
    ];
    const table = document.createElement('table');
    const head = table.createTHead().insertRow();
    for (const title of ['Key', 'What it does']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = title;
      head.append(th);
    }
    const body = table.createTBody();
    for (const [key, action] of rows) {
      const row = body.insertRow();
      row.insertCell().textContent = key;
      row.insertCell().textContent = action;
    }
    return table;
  }
}
