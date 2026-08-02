const escapeTsvField = (value) =>
  String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\t", "\\t")
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n");

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
      .map(escapeTsvField)
      .join("\t"),
  );

  return [...header, ...lines].join("\n");
};
