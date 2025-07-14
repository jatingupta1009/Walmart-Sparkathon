import { useState } from 'react';
import axios from 'axios';

const CreateFamily = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) return alert("Please enter a family name");
    setLoading(true);
    try {
      const { data } = await axios.post('/api/family/create', { name });
      onSuccess?.(data);
      setName('');
    } catch (err) {
      alert('Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-2 max-w-md mx-auto">
      <h2 className="text-lg font-bold">Create a Family</h2>
      <input
        className="border p-2 w-full rounded"
        placeholder="Family Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Family'}
      </button>
    </div>
  );
};

export default CreateFamily;
