import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setUserLoggedIn(loggedIn);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const authType = isLogin ? 'login' : 'register'; 
      const res = await axios.post(`http://localhost:5000/${authType}`, { username, password }, { withCredentials: true });
      alert(res.data.message);
      if (res.status === 200) {
        setUserLoggedIn(true);
        localStorage.setItem('userLoggedIn', 'true');
      }
    } catch (err) {
      console.log('Auth error:', err);
      alert('Failed to login/register');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setUploadedFile(res.data);
      alert('File uploaded successfully');
    } catch (err) {
      console.log('Upload error:', err);
      alert('File upload failed');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setUserLoggedIn(false);
      localStorage.removeItem('userLoggedIn');
      alert('Logged out');
    } catch (err) {
      console.log('Logout failed', err);
    }
  };

  return (
    <div style={styles.container}>
      {userLoggedIn ? (
        <>
          <h2>Upload File</h2>
          <form onSubmit={handleFileUpload} style={styles.form}>
            <input type="file" onChange={handleFileChange} style={styles.input} />
            {previewUrl && (
              <div style={styles.previewContainer}>
                <h3>File Preview:</h3>
                {file?.type?.startsWith('image') && <img src={previewUrl} alt="preview" style={styles.image} />}
                {file?.type?.startsWith('audio') && <audio controls src={previewUrl} style={styles.media} />}
                {file?.type?.startsWith('video') && <video controls src={previewUrl} style={styles.media} />}
                {file?.type === 'application/pdf' && <iframe src={previewUrl} style={styles.pdf} />}
              </div>
            )}
            <button type="submit" style={styles.button}>Upload</button>
          </form>
          {uploadedFile && <h3>Uploaded File URL: {uploadedFile.url}</h3>}
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </>
      ) : (
        <>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <form onSubmit={handleAuthSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {isLogin ? 'Login' : 'Register'}
            </button>
            <button type="button" onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
              {isLogin ? 'Go to Register' : 'Go to Login'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '20px',
  },
  image: {
    width: '200px',
    height: 'auto',
    borderRadius: '5px',
  },
  media: {
    width: '300px',
  },
  pdf: {
    width: '300px',
    height: '400px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

export default App;
