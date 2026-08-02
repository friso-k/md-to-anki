import fs from "node:fs/promises";
import { parse as parseYaml } from "yaml";

const createMarkdownCardError = (filePath, message) =>
  new Error(`${filePath}: ${message}`);

const extractFrontmatter = (markdown, filePath) => {
  const normalizedMarkdown = markdown.replaceAll("\r\n", "\n");

  if (!markdown.startsWith("---\n") && !markdown.startsWith("---\r\n")) {
    return {
      frontmatter: "",
      body: normalizedMarkdown.trim(),
    };
  }

  const closingFenceMatch = normalizedMarkdown
    .slice(4)
    .match(/^---[ \t]*(?:\n|$)|\n[ \t]*---[ \t]*(?:\n|$)/);

  if (!closingFenceMatch || closingFenceMatch.index === undefined) {
    throw createMarkdownCardError(
      filePath,
      "frontmatter closing fence not found",
    );
  }

  const closingFenceIndex = 4 + closingFenceMatch.index;

  return {
    frontmatter: normalizedMarkdown.slice(4, closingFenceIndex).trim(),
    body: normalizedMarkdown
      .slice(closingFenceIndex + closingFenceMatch[0].length)
      .trim(),
  };
};

const parseFrontmatter = (frontmatter, filePath) => {
  try {
    return parseYaml(frontmatter) ?? {};
  } catch (error) {
    throw createMarkdownCardError(
      filePath,
      `invalid YAML frontmatter: ${error.message}`,
    );
  }
};

const normalizeTags = (tags, filePath) => {
  if (tags === undefined || tags === null || tags === "") {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map(String).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags.split(/\s+/).filter(Boolean);
  }

  throw createMarkdownCardError(filePath, "tags must be a string or list");
};

const splitCardBody = (body, filePath) => {
  const dividerMatch = body.match(/^---[ \t]*$/m);

  if (!dividerMatch || dividerMatch.index === undefined) {
    throw createMarkdownCardError(
      filePath,
      "card body must contain a --- divider",
    );
  }

  const front = body.slice(0, dividerMatch.index).trim();
  const back = body.slice(dividerMatch.index + dividerMatch[0].length).trim();

  if (front === "" || back === "") {
    throw createMarkdownCardError(
      filePath,
      "front and back must both be present",
    );
  }

  return { front, back };
};

export const parseMarkdownCard = async (filePath) => {
  const markdown = await fs.readFile(filePath, "utf8");
  const { frontmatter, body } = extractFrontmatter(markdown, filePath);
  const metadata = parseFrontmatter(frontmatter, filePath);

  return {
    ...splitCardBody(body, filePath),
    tags: normalizeTags(metadata.tags, filePath),
  };
};
