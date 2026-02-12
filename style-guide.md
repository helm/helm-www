# Documentation Style Guide

This page lists writing style guidelines for the Helm documentation.
These are guidelines, not rules.
Use your best judgement, and depart from these guidelines when doing so improves your content.

By default, the Helm docs use the Google Developer Docs Style Guide: https://developers.google.com/style/

This document provides several key guidelines, plus some house rules that aren't captured or differ from what's in the Google Developer Docs Style Guide.
Refer to the Google Developer Docs Style Guide for additional guidelines that are not covered here.

## Helm Terminology

For a list of common Helm terms, see the [Glossary](https://helm.sh/docs/glossary/)

## Word Choice, Tone, and Voice

- Use active voice
- Use the second person "you" to address the reader. Never use "let's" or "we" to refer to an action that the user is doing
- Use present tense (for example, use "returns" and not "will return")
- Write in a friendly tone without using slang, jargon, or frivolous words
- Avoid marketing language that is overly promotional
- Avoid terms like "simple" or "easy"
- Use common words. For example, don't use words like "utilize" or "leverage" when you mean "use". Using common words makes the docs more suitable for a global audience
- Avoid time-bound terminology like "currently", "new", "at this time", and "now". Instead, write timeless documentation that makes no assumptions about a reader's prior knowledge.
- Avoid using the word "should". Instead, strive for more prescriptive documentation. For example, if an action is required, use words and phrase like "must" or "ensure that". If an action is optional/recommended, use words and phrases like "you can", "might", or "we recommend".

## Readability

- Break up walls of text to make content easier to scan
- Try to use fewer than 26 words per sentence
- Define acronyms and abbreviations on first usage
- Procedural/how-to content must use numbered steps. For one-step procedures, use a bullet point. See https://developers.google.com/style/procedures#single-step-procedures for examples

## Text Formatting

- Use bold and italic text sparingly.
  - Bold text is primarily used to identify UI elements. For example, "Click **Save**." 
  - Do not use bold text to emphasize important content. Instead, if discoverability is a concern, consider how the content could be reorganized or how you could use clearer headings. 
  - It's okay to use bold text for introducing an example (`**Example:**`) or for run-in headings in unordered lists (`* **Item 1:** Description`)

## Titles and Headings

- Use title case for titles and headings
- Use a bare infinitive verb form for titles and headings for how-to content. As in, use "Create a Release" instead of "Creating a Release"
- Don't skip levels in the heading hierarchy. For example, an h3 element must only appear after an h2

## Cross References

- Use descriptive link text. This is important to help improve both accessibility and readability. In general, effective link text is formatted like this: `For more information about X, see [Page or Section Title]`, where "X" is a description of the subject matter. For example, `For more information about accessing values from within templates, see [Subcharts and Global Values](/chart_template_guide/subcharts_and_globals).`
- Avoid vague link text like `"click [here](link) for more information"` or `"see this [blog post](link)"`
