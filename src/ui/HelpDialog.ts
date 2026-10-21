/** Keyboard help: every navigator keystroke, in a table (DES-KEY-007). */
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
      ['Left Arrow', 'When the Dependencies list is active, go to its highlighted entry, earlier in time.'],
      ['Right Arrow', 'When the Enabled list is active, go to its highlighted entry, later in time.'],
      ['Enter', 'Go to the highlighted entry in the active list.'],
      ['Up Arrow and Down Arrow', 'Move through the active list.'],
      ['Home and End', 'Go to the first or last entry in the active list.'],
      [`${listModifierName}+Left Arrow and ${listModifierName}+Right Arrow`, 'Go to the previous or next list.'],
      ['Backspace', 'Go back one step along the path you took.'],
      ['Space', 'Summary of the current moment.'],
      ['D', 'Description.'],
      ['T', 'Tags.'],
      ['L', 'Location.'],
      ['P', 'The path you took.'],
      ['I', 'Move to the Details region, to read it in browse mode. Escape returns to the tree.'],
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
