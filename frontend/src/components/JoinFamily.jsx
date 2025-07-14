import { useState } from 'react';
import axios from 'axios';

const JoinFamily = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code) return alert("Please enter a family code");
    setLoading(true);
    try {
      const { data } = await axios.post('/api/family/join', { code });
      onSuccess?.(data);
      setCode('');
    } catch (err) {
      alert('Failed to join family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-2 max-w-md mx-auto">
      <h2 className="text-lg font-bold">Join a Family</h2>
      <input
        className="border p-2 w-full rounded"
        placeholder="Enter Family Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleJoin}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Joining...' : 'Join Family'}
      </button>
    </div>
  );
};

export default JoinFamily;
