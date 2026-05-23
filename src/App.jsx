import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/notes')
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  const createNote = async () => {
    const res = await axios.post('http://localhost:3000/api/notes', { title, content });
    setNotes([...notes, res.data.note]);
    setTitle('');
    setContent('');
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:3000/api/notes/${id}`);
    setNotes(notes.filter(note => note._id !== id));
  };

  const updateNote = async (id) => {
    const res = await axios.put(`http://localhost:3000/api/notes/${id}`, {
      title: editTitle,
      content: editContent
    });
    setNotes(notes.map(note => note._id === id ? res.data.note : note));
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        📝 Notes App
      </h1>

      {/* Note Banao */}
      <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mb-8">
        <input
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 outline-none focus:border-blue-400"
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 outline-none focus:border-blue-400"
          placeholder='Content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
          onClick={createNote}
        >
          Save Note
        </button>
      </div>

      {/* Notes List */}
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {notes.map(note => (
          <div key={note._id} className="bg-white rounded-xl shadow p-5">
            {editId === note._id ? (
              <div>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 outline-none focus:border-blue-400"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 outline-none focus:border-blue-400"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    onClick={() => updateNote(note._id)}
                  >
                    Save
                  </button>
                  <button
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{note.title}</h3>
                <p className="text-gray-600 mb-4">{note.content}</p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
                    onClick={() => {
                      setEditId(note._id);
                      setEditTitle(note.title);
                      setEditContent(note.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

