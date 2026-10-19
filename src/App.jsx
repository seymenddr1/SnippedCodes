import React, { useEffect, useState } from 'react';

const languages = ['All', 'JavaScript', 'Python', 'HTML', 'CSS'];

const examples = [
  { id: 1, title: 'Hello World', language: 'JavaScript', code: 'console.log("Hello World");' },
  { id: 2, title: 'Print Text', language: 'Python', code: 'print("Hello World")' },
  { id: 3, title: 'Heading', language: 'HTML', code: '<h1>Hello World</h1>' },
];

function App() {
  // Load saved snippets, or use the examples on the first visit.
  const [snippets, setSnippets] = useState(() => {
    const saved = localStorage.getItem('snippets');
    try {
      return saved ? JSON.parse(saved) : examples;
    } catch {
      return examples;
    }
  });

  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('JavaScript');
  const [editingId, setEditingId] = useState(null);

  // Save whenever the list changes.
  useEffect(() => {
    localStorage.setItem('snippets', JSON.stringify(snippets));
  }, [snippets]);

  function saveSnippet(event) {
    event.preventDefault();

    if (editingId !== null) {
      // Update an existing snippet.
      setSnippets(snippets.map((item) =>
        item.id === editingId
          ? { id: editingId, title, language: snippetLanguage, code }
          : item
      ));
    } else {
      // Add a new snippet.
      setSnippets([...snippets, { id: Date.now(), title, language: snippetLanguage, code }]);
    }

    clearForm();
  }

  function editSnippet(item) {
    setEditingId(item.id);
    setTitle(item.title);
    setCode(item.code);
    setSnippetLanguage(item.language);
  }

  function deleteSnippet(id) {
    setSnippets(snippets.filter((item) => item.id !== id));
    if (editingId === id) clearForm();
  }

  function clearForm() {
    setEditingId(null);
    setTitle('');
    setCode('');
    setSnippetLanguage('JavaScript');
  }

  const visibleSnippets = selectedLanguage === 'All'
    ? snippets
    : snippets.filter((item) => item.language === selectedLanguage);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>SnippedCodes</h2>
        <p>Languages</p>
        {languages.map((language) => (
          <button
            key={language}
            className={selectedLanguage === language ? 'active' : ''}
            onClick={() => setSelectedLanguage(language)}
          >
            {language}
          </button>
        ))}
      </aside>

      <main>
        <h1>Code Snippets</h1>
        <p className="intro">Save and organize small pieces of code.</p>

        <form onSubmit={saveSnippet}>
          <h3>{editingId !== null ? 'Edit Snippet' : 'Add Snippet'}</h3>
          <input
            placeholder="Snippet title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <select value={snippetLanguage} onChange={(event) => setSnippetLanguage(event.target.value)}>
            {languages.slice(1).map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
          <textarea
            placeholder="Paste your code here"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            rows="4"
            required
          />
          <div className="actions">
            <button type="submit">{editingId !== null ? 'Save Changes' : 'Add Snippet'}</button>
            {editingId !== null && <button type="button" onClick={clearForm}>Cancel</button>}
          </div>
        </form>

        <h2>{selectedLanguage === 'All' ? 'All Snippets' : selectedLanguage}</h2>
        {visibleSnippets.length === 0 && <p>No snippets yet.</p>}
        {visibleSnippets.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <small>{item.language}</small>
            <pre><code>{item.code}</code></pre>
            <div className="actions">
              <button onClick={() => editSnippet(item)}>Edit</button>
              <button onClick={() => deleteSnippet(item.id)}>Delete</button>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}

export default App;
