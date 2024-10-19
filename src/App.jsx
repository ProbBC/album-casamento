import { useState } from 'react';
import axios from 'axios';
import './App.css';

const URL = 'https://album-casamento-backend.onrender.com/upload';

function App() {
  const [uploadImage, setUploadImage] = useState({ urls: [] });
  const [msg, setMsg] = useState('');
  const [fileChosen, setfileChosen] = useState('');

  const createImage = async (newImage) => {
    axios
      .post(URL, newImage)
      .then((res) => {
        const { status } = res;
        if (status === 201) {
          setMsg(
            `${
              newImage.urls.length > 1 ? 'Imagens enviadas' : 'Imagem enviada'
            } com sucesso!`
          );
          return;
        }
        setMsg('Upload falhou!');
      })
      .catch(() => {
        setMsg('Upload falhou!');
      });
  };

  const handleSubmit = (e) => {
    if (uploadImage.urls.length === 0) {
      return;
    }
    e.preventDefault();
    setMsg('Enviando... Aguarde um instante.');
    createImage(uploadImage, e);
  };

  const handleFileUpload = async (e) => {
    setMsg('');
    const files = e.target.files;
    if (files.length > 0) {
      setfileChosen(
        `${files.length} ${
          files.length > 1 ? 'fotos escolhidas' : 'foto escolhida'
        }`
      );
    }
    const base64 = await convertToBase64(files);
    setUploadImage({ ...uploadImage, urls: base64 });
  };

  const handleViewAlbum = () => {
    window.open('https://drive.google.com/drive/folders/1u7m3xmPc_fJjT6oJQLwZsBmJNuLrtuAh?usp=drive_link', '_blank');
  };

  return (
    <div className="App">
      <div className="image">
        <img src="casal3.jpg"></img>
      </div>

      <h1>Maria Eduarda & Rodrigo</h1>

      <form onSubmit={handleSubmit}>
        <button onClick={handleViewAlbum} className="view-album-btn">Ver álbum</button>

        <input
          type="file"
          name="url"
          id="file-upload"
          accept="image/*"
          onChange={(e) => handleFileUpload(e)}
          multiple
          hidden
        />
        <label htmlFor="file-upload">Escolher fotos</label>
        <span id="file-chosen">{fileChosen}</span>
        <button type="submit">Enviar</button>
      </form>

      {msg && <span>{msg}</span>}
    </div>
  );
}

const convertToBase64 = async (files) => {
  const base64 = [];
  for (let i = 0; i < files.length; i++) {
    const url = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[i]);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    base64.push(url);
  }
  return base64;
};

export default App;
