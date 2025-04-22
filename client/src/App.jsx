import { useEffect, useState } from 'react'
import './App.css'
import io from "socket.io-client"
import { Input } from './components/Input'

const socket = io('http://localhost:3000'); // ✅ fixed protocol

function App() {
  const [score, setScore] = useState({});
  const [allScores, setAllScores] = useState([]);

  useEffect(() => {
    
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("playerScores", (playerScores) => {
      setAllScores(playerScores);
      console.log("playerScores", playerScores); // ✅ Use direct value
    });

    return () => {
      socket.off("playerScores");
    };
  }, []);

  function handleInput(event) {
    const { name, value } = event.target;
    setScore(prev => ({ ...prev, [name]: value }));
  }

  function sendScore() {
    socket.emit('scores', score);
  }

  return (
    <>
      <h1>React Multiplayer Dashboard</h1>
      <Input name="name" placeholder="Enter your name" handleInput={handleInput} />
      <br />
      <Input name="score" placeholder="Enter your score" handleInput={handleInput} />
      <br />
      <button onClick={sendScore}>Publish Score</button>
      <br />
      <ul>
      {allScores.map((p, idx) => (
        <li key={idx}>{p.name}: {p.score}</li>
      ))}
    </ul>

    </>
  )
}

export default App;
