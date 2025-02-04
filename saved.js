function analyzeTextNLP(text) {
   
const inputText = document.getElementById('inputText').value;
const doc = nlp(inputText);

// Extract raw terms using our helper function
let nouns = extractTerms(doc.nouns(), 'Noun');
let verbs = extractTerms(doc.verbs(), 'Verb');
let adjectives = extractTerms(doc.adjectives(), 'Adjective');

// --- Further filtering ---

// 1. Remove pronouns from the nouns list.
// Compromise provides pronoun detection; we can extract them and filter them out.
const pronouns = doc.pronouns().out('array').map(p => p.toLowerCase());
nouns = nouns.filter(word => !pronouns.includes(word.toLowerCase()));

// 2. Optionally, filter out verbs that appear to be gerunds or participles.
// You can do this by checking if the original verb text in the JSON contains a tag like 'Gerund'
// For this, we'll re-read the verbs JSON and filter out those with a 'Gerund' tag.
const verbJson = doc.verbs().json();
verbs = verbJson.map(v => {
  // Use the root if available, but also check tags.
  const term = v.terms.find(t => t.tags && t.tags.includes('Verb'));
  return term ? term.text : v.text;
}).filter((verb, index) => {
  // Check the corresponding JSON object for gerund or participle tags.
  const tags = verbJson[index].terms.map(t => t.tags).flat();
  // Filter out if tags include 'Gerund' or 'Participle' (adjust as needed).
  if (tags.includes('Gerund') || tags.includes('Participle')) {
    return false;
  }
  return true;
});

// Simple tone estimation based on sentence count and adjective richness:
const sentences = doc.sentences().out('array');
const sentiment = sentences.length > 3 || adjectives.length > 5 ? "Descriptive" : "Concise";

// Get the normalized text
const correctedText = doc.normalize().out('text');

document.getElementById('cleanedText').innerHTML = `
    <strong>Corrected Text:</strong> ${correctedText} <br>
    <strong>Nouns:</strong> ${nouns.join(', ') || "None"} <br>
    <strong>Verbs:</strong> ${verbs.join(', ') || "None"} <br>
    <strong>Adjectives:</strong> ${adjectives.join(', ') || "None"} <br>
    <strong>Estimated Tone:</strong> ${sentiment}
`;

  // const words = doc.terms().out('array').map(word => 
  //     word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '')
  // ).filter(Boolean); // Remove empty strings
  // return { words };
  const words = text.split(/(\s+|[,.!?;:])/).filter(token => token.trim() !== "");
  return { words };
}