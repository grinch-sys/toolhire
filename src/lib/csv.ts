export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    current.push(field);
    field = '';
  };

  const pushRow = () => {
    pushField();
    rows.push(current);
    current = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      pushField();
    } else if (char === '\n') {
      pushRow();
    } else if (char === '\r') {
      if (text[i + 1] === '\n') {
        i += 1;
      }
      pushRow();
    } else {
      field += char;
    }
  }

  if (field !== '' || current.length > 0) {
    pushRow();
  }

  return rows.filter((row) => row.length > 0 && !(row.length === 1 && row[0] === ''));
}

export function stringifyCSV(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          if (/[",\n\r]/u.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    )
    .join('\n');
}
