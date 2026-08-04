const formatTsvField = (value) =>
  String(value ?? "")
    // Anki imports HTML because of the #html:true header below. Keep each
    // note on one TSV row while preserving Markdown line breaks in the card.
    .replace(/\r?\n|\r/g, "<br>")
    .replaceAll("\t", " ");

export const createTsv = (data, deckName) => {
  const header = [
    "#separator:Tab",
    "#html:true",
    "#notetype:Basic",
    `#deck:${deckName}`,
    "#guid column:1",
    "#tags column:4",
    "#columns:ID\tFront\tBack\tTags",
  ];

  const lines = data.map(({ id, front, back, tags }) =>
    [
      id,
      front,
      back,
      tags.join(" "),
    ]
      .map(formatTsvField)
      .join("\t"),
  );

  return [...header, ...lines].join("\n");
};
